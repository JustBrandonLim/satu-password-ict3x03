import { NextRequest, NextResponse } from "next/server";
import { HashPassword, GenerateNewWrappingKey, GenerateRandomKey, EncryptAES } from "@libs/crypto-lib";
import { authenticator } from "otplib";
import { PrismaClient, Prisma } from "@prisma/client";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const prisma = new PrismaClient();

    const registerData: RegisterData = await nextRequest.json();

    const [hashedPassword, hashedPasswordSalt] = HashPassword(registerData.password);

    const totpSecret = authenticator.generateSecret();

    const [wrappingKey, wrappingKeySalt] = GenerateNewWrappingKey(registerData.password);

    const masterKey = GenerateRandomKey();

    const encryptedMasterKey = EncryptAES(masterKey, wrappingKey);

    await prisma.login
      .create({
        data: {
          email: registerData.email,
          hashedPassword: hashedPassword,
          hashedPasswordSalt: hashedPasswordSalt,
          totpSecret: totpSecret,
        },
      })
      .then(async (loginData) => {
        await prisma.user.create({
          data: {
            name: registerData.name,
            encryptedMasterKey: encryptedMasterKey,
            wrappingKeySalt: wrappingKeySalt,
            loginId: loginData.id,
          },
        });
      });

    const otpUrl = authenticator.keyuri(registerData.name, "SatuPassword", totpSecret);

    return NextResponse.json({ message: "Successful register!", otpUrl: otpUrl });
  } catch (exception) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2002") {
        return NextResponse.json({ message: "Email already exists!" });
      }
    } else return NextResponse.json({ message: "Something went wrong!" });
  }
}
