import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { EncryptAES } from "@libs/crypto";
import { GetPrismaClient } from "@libs/prisma";

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

      const login = await GetPrismaClient().login.findUniqueOrThrow({
        where: {
          email: payload.email as string,
        },
      });

      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          loginId: login.id,
        },
      });

      await GetPrismaClient().note.create({
        data: {
          title: vaultStoreNoteData.title,
          encryptedContent: EncryptAES(vaultStoreNoteData.content, payload.masterKey as string),
          userId: user.id,
        },
      });

      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}