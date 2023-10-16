import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { EncryptAES } from "@libs/crypto-lib";

interface VaultStoreNoteData {
  title: string;
  content: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const prisma = new PrismaClient();

      const vaultStoreNoteData: VaultStoreNoteData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const login = await prisma.login.findUniqueOrThrow({
        where: {
          email: payload.email as string,
        },
      });

      await prisma.note.create({
        data: {
          title: vaultStoreNoteData.title,
          encryptedContent: EncryptAES(vaultStoreNoteData.content, payload.masterKey as string),
          userId: login.id,
        },
      });

      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}