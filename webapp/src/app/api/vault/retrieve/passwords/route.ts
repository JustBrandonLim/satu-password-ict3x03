import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload, protectedHeader } = await jwtDecrypt(
        encryptedJwt,
        DecodeHex(process.env.SECRET_KEY!),
        {
          issuer: "https://satupassword.com",
          audience: "https://satupassword.com",
        }
      );

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      const passwords = await prisma.password.findMany({
        where: {
          userId: user.id,
        },
      });
      logger.info(
        `User ID: ${payload.id} Action: RetrievePasswords Message: Retrieve Passwords successful`
      );
      return NextResponse.json(
        { message: "Successful!", passwords: passwords },
        { status: 200 }
      );
    }
    logger.info(
      `Action: RetrievePasswords Message: No JWT Token. Retrieve Passwords not successful`
    );
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :RetrievePasswords Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
