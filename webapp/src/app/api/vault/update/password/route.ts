import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { EncryptAES } from "@libs/crypto";
import { GetPrismaClient } from "@libs/prisma";
import logger from "@libs/logger";

interface VaultUpdatePasswordData {
  id: number;
  title: string;
  url: string;
  username: string;
  password: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const vaultUpdatePasswordData: VaultUpdatePasswordData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      await GetPrismaClient().password.update({
        where: {
          id: vaultUpdatePasswordData.id,
        },
        data: {
          title: vaultUpdatePasswordData.title,
          url: vaultUpdatePasswordData.url,
          username: vaultUpdatePasswordData.username,
          encryptedPassword: EncryptAES(vaultUpdatePasswordData.password, payload.masterKey as string),
          userId: user.id,
        },
      });

      logger.info(`User ID: ${payload.id} Action: UpdateStoredPassword Message: StoredPassword Updated successfully`);
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    logger.info(`Action :UpdatePassword Message: No JWT Token. Update Password not successful`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {

    logger.info(`Action :UpdatePassword Message: Internal Server Error`);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
