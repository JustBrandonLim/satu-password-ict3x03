import { NextRequest, NextResponse } from "next/server";
import {
  HashPassword,
  GenerateNewWrappingKey,
  GenerateRandomKey,
  EncryptAES,
} from "@libs/crypto";
import { authenticator } from "otplib";
import { Prisma } from "@prisma/client";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const registerData: RegisterData = await nextRequest.json();

    const [hashedPassword, hashedPasswordSalt] = HashPassword(
      registerData.password
    );

    const totpSecret = authenticator.generateSecret();

    const [wrappingKey, wrappingKeySalt] = GenerateNewWrappingKey(
      registerData.password
    );

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

    const otpUrl = authenticator.keyuri(
      registerData.name,
      "SatuPassword",
      totpSecret
    );

    logger.info(
      `User: ${registerData.email} Message: Account created successfully.`
    );
    return NextResponse.json(
      { message: "Successful!", otpUrl: otpUrl },
      { status: 200 }
    );
  } catch (exception) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2002") {
        logger.info(
          `Category: RegistrationAttempt Message: Email is already registered ActionTaken : Registration request denied.`
        );
        return NextResponse.json(
          { message: "Email already exists!" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
