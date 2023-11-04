import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

interface VaultDeleteNoteData {
  id: number;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const vaultDeleteNoteData: VaultDeleteNoteData = await nextRequest.json();

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

      await prisma.note.delete({
        where: {
          id: vaultDeleteNoteData.id,
          userId: user.id,
        },
      });

      logger.info(`User: ${payload.id} Message: Note deleted successfully.`);
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }
    logger.info(
      `Action: DeleteNote Message: No JWT Token. Note delete not successful`
    );

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :DeleteNote Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
