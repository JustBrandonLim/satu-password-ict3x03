import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
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

      const passwords = await GetPrismaClient().password.findMany({
        where: {
          userId: user.id,
        },
      });

      return NextResponse.json({ message: "Successful!", passwords: passwords }, { status: 200 });
    }
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}