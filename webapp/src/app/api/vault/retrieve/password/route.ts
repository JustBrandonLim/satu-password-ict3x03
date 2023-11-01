import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { DecryptAES } from "@libs/crypto";
import logger from "@libs/logger";


export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;
    const vaultRetrievePasswordData = nextRequest.nextUrl.searchParams.get("password");

    if (encryptedJwt !== undefined && vaultRetrievePasswordData !== null) {
      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      logger.info(`Action: DecryptPassword Message: Decrypt Password successful`);
      return NextResponse.json(
        { message: "Successful!", password: DecryptAES(vaultRetrievePasswordData, payload.masterKey as string) },
        { status: 200 }
      );
    }
    logger.info(`Action: DecryptPassword Message: No JWT Token. Decrypt Password not successful`);

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {

    logger.info(`Action :DecryptPassword Message: Internal Server Error`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
