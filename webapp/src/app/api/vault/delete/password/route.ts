import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

interface VaultDeletePasswordData {
  id: number;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const vaultDeletePasswordData: VaultDeletePasswordData =
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

      await prisma.password.delete({
        where: {
          id: vaultDeletePasswordData.id,
          userId: user.id,
        },
      });

      logger.info(
        `User: ${payload.id} Message: StoredPassword deleted successfully.`
      );
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    logger.info(
      `Action: DeletePassword Message: No JWT Token. Password delete not successful`
    );
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :DeletePassword Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
