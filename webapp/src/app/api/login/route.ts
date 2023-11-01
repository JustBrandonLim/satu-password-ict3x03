import { NextRequest, NextResponse } from "next/server";
import { GetPrismaClient } from "@libs/prisma";
import { VerifyPassword, GenerateWrappingKey, DecryptAES, GenerateRandomKey } from "@libs/crypto";
import { DecodeHex } from "@libs/enc-dec";
import { authenticator } from "otplib";
import { EncryptJWT } from "jose";
import logger from "@libs/logger";

interface LoginData {
  email: string;
  password: string;
  otp: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const loginData: LoginData = await nextRequest.json();

    const login = await GetPrismaClient().login.findUniqueOrThrow({
      where: {
        email: loginData.email,
      },
    });

    if (VerifyPassword(loginData.password, login.hashedPassword, login.hashedPasswordSalt)) {
      if (authenticator.check(loginData.otp, login.totpSecret)) {
        const user = await GetPrismaClient().user.findUniqueOrThrow({
          where: {
            loginId: login.id,
          },
        });

        const wrappingKey = GenerateWrappingKey(loginData.password, user.wrappingKeySalt);
        const masterKey = DecryptAES(user.encryptedMasterKey, wrappingKey);
        const jwtId = GenerateRandomKey();

        await GetPrismaClient().login.update({
          where: {
            email: loginData.email,
          },
          data: {
            jwtId: jwtId,
          },
        });

        const encryptedJwt = await new EncryptJWT({ id: login.id, email: login.email, masterKey: masterKey, jwtId: jwtId })
          .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
          .setIssuer("https://satupassword.com")
          .setAudience("https://satupassword.com")
          .setIssuedAt()
          .setExpirationTime("3m")
          .encrypt(DecodeHex(process.env.SECRET_KEY!));

        const nextResponse: NextResponse = NextResponse.json({ message: "Successful!" }, { status: 200 });
        nextResponse.cookies.set("encryptedjwt", encryptedJwt, {
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
        
        logger.info(`User: ${loginData.email} Message: Login Successful.`);

        return nextResponse;
      }
    }

    logger.info(`User: ${loginData.email} Action: Login  Message: Incorrect email, password, or otp!`);
    return NextResponse.json({ message: "Incorrect email, password or otp!" }, { status: 400 });
  } catch {
    logger.info(`Action :Login Message: Internal Server Error`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
