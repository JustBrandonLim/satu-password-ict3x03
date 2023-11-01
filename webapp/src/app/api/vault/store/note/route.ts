import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { EncryptAES } from "@libs/crypto";
import { GetPrismaClient } from "@libs/prisma";
import logger from "@libs/logger";

interface VaultStoreNoteData {
  title: string;
  content: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const vaultStoreNoteData: VaultStoreNoteData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      await GetPrismaClient().note.create({
        data: {
          title: vaultStoreNoteData.title,
          encryptedContent: EncryptAES(vaultStoreNoteData.content, payload.masterKey as string),
          userId: user.id,
        },
      });

      logger.info(`User ID: ${payload.id} Action: StoreNotes Message: Notes Stored successful`);
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    logger.info(`Action :StoreNote Message: No JWT Token. Store Note not successful`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {

    logger.info(`Action :StoreNote Message: Internal Server Error`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
