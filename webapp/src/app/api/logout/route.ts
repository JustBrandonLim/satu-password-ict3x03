import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";
import logger from "@libs/logger";

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      await GetPrismaClient().login.update({
        where: {
          id: payload.id as number,
        },
        data: {
          jwtId: null,
        },
      });

      logger.info(`User: ${payload.id} Action:Logout Message: Logout Successful.`);
      const nextResponse: NextResponse = NextResponse.json({ message: "Successful!" }, { status: 200 });
      nextResponse.cookies.delete("encryptedjwt");

      return nextResponse;
    }
    logger.info(`Info: No JWT Token Action:Logout Message: Logout Successful.`);
    return NextResponse.json({ message: "Successful!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
