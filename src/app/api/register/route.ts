import { NextRequest, NextResponse } from "next/server";
import { HashPassword, GenerateWrappingKey, GenerateRandomKey, EncryptAES } from "@libs/crypto-lib";
import { authenticator } from "otplib";
import { PrismaClient } from "@prisma/client";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const registerData: RegisterData = await nextRequest.json();

    const [hashedPassword, hashedPasswordSalt] = HashPassword(registerData.password);

    const totpSecret = authenticator.generateSecret();

    const [wrappingKey, wrappingKeySalt] = GenerateWrappingKey(registerData.password);

    const masterKey = GenerateRandomKey();

    const encryptedMasterKey = EncryptAES(masterKey, wrappingKey);

    const prisma = new PrismaClient();

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

    return NextResponse.json({ otpUrl: otpUrl });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
