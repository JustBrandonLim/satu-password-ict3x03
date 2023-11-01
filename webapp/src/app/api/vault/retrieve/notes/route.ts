import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";
import logger from "@libs/logger";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      const notes = await GetPrismaClient().note.findMany({
        where: {
          userId: user.id,
        },
      });

      logger.info(`Action: RetrieveNotes Message: Retrieve Notes successful`);
      return NextResponse.json({ message: "Successful!", notes: notes }, { status: 200 });
    }
    logger.info(`Action: RetrieveNotes Message: No JWT Token. Retrieve Notes not successful`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    logger.info(`Action :RetrieveNotes Message: Internal Server Error`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
