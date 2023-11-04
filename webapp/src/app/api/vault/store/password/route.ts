import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { EncryptAES } from "@libs/crypto";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

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
      const vaultStorePasswordData: VaultStorePasswordData =
        await nextRequest.json();

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

      await prisma.password.create({
        data: {
          title: vaultStorePasswordData.title,
          url: vaultStorePasswordData.url,
          username: vaultStorePasswordData.username,
          encryptedPassword: EncryptAES(
            vaultStorePasswordData.password,
            payload.masterKey as string
          ),
          userId: user.id,
        },
      });

      logger.info(
        `User ID: ${payload.id} Action: StorePassword(User Created) Message: StorePassword(User Created) Stored successful`
      );
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    logger.info(
      `Action :StorePassword Message: No JWT Token. Store Note not successful`
    );
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :StorePassword Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
