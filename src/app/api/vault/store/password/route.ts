import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { EncryptAES } from "@libs/crypto-lib";

interface VaultStorePasswordData {
  title: string;
  url: string;
  username: string;
  password: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const prisma = new PrismaClient();

      const vaultStorePasswordData: VaultStorePasswordData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const login = await prisma.login.findUniqueOrThrow({
        where: {
          email: payload.email as string,
        },
      });

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          loginId: login.id,
        },
      });

      await prisma.password.create({
        data: {
          title: vaultStorePasswordData.title,
          url: vaultStorePasswordData.url,
          username: vaultStorePasswordData.username,
          encryptedPassword: EncryptAES(vaultStorePasswordData.password, payload.masterKey as string),
          userId: user.id,
        },
      });

      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch (exception) {
    console.log(exception);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
