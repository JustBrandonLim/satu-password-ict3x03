import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const prisma = new PrismaClient();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const login = await prisma.login.findUniqueOrThrow({
        where: {
          email: payload.email as string,
        },
      });

      const passwords = await prisma.password.findMany({
        where: {
          userId: login.id,
        },
      });

      return NextResponse.json({ message: "Successful!", passwords: passwords }, { status: 200 });
    }
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
