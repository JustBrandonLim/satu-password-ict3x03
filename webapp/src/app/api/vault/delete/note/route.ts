import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";

interface VaultDeleteNoteData {
  id: number;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const vaultDeleteNoteData: VaultDeleteNoteData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      await GetPrismaClient().note.delete({
        where: {
          id: vaultDeleteNoteData.id,
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
