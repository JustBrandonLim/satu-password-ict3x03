import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { VerifyPassword, GenerateWrappingKey, DecryptAES, GenerateRandomKey } from "@libs/crypto-lib";
import { DecodeHex } from "@libs/enc-dec-lib";
import { authenticator } from "otplib";
import { EncryptJWT } from "jose";

interface LoginData {
  email: string;
  password: string;
  otp: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const prisma = new PrismaClient();

    const loginData: LoginData = await nextRequest.json();

    const login = await prisma.login.findUniqueOrThrow({
      where: {
        email: loginData.email,
      },
    });

    if (VerifyPassword(loginData.password, login.hashedPassword, login.hashedPasswordSalt)) {
      if (authenticator.check(loginData.otp, login.totpSecret)) {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: login.id,
          },
        });

        const wrappingKey = GenerateWrappingKey(loginData.password, user.wrappingKeySalt);

        const masterKey = DecryptAES(user.encryptedMasterKey, wrappingKey);

        const jwtId = GenerateRandomKey();

        await prisma.login.update({
          where: {
            email: loginData.email,
          },
          data: {
            jwtId: jwtId,
          },
        });

        const encryptedJwt = await new EncryptJWT({ email: login.email, masterKey: masterKey, jwtId: jwtId })
          .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
          .setIssuer("https://satupassword.com")
          .setAudience("https://satupassword.com")
          .setIssuedAt()
          .setExpirationTime("3m")
          .encrypt(DecodeHex(process.env.SECRET_KEY!));

        const nextResponse: NextResponse = NextResponse.json({ message: "Successful login!" });
        nextResponse.cookies.set("encryptedjwt", encryptedJwt);

        return nextResponse;
      }
    }

    return NextResponse.json({ message: "Incorrect email, password or token!" });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
