import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { VerifyPassword, GenerateWrappingKey, DecryptAES } from "@libs/crypto-lib";
import { DecodeHex } from "@libs/enc-dec-lib";
import { authenticator } from "otplib";
import * as jose from "jose";

interface LoginData {
  email: string;
  password: string;
  otp: string;
}

const prisma = new PrismaClient();

export async function POST(nextRequest: NextRequest) {
  try {
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

        const ejwt = await new jose.EncryptJWT({ email: login.email, masterKey: masterKey })
          .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
          .setIssuedAt()
          .setExpirationTime("1h")
          .encrypt(DecodeHex(process.env.SECRET_KEY!));

        const nextResponse: NextResponse = NextResponse.json({ message: "Succeeded!" });
        nextResponse.cookies.set("ejwt", ejwt);

        return nextResponse;
      }
    }

    return NextResponse.json({ message: "Failed!" });
  } catch (e){
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
