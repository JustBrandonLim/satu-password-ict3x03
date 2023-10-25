import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      await GetPrismaClient().login.update({
        where: {
          email: payload.email as string,
        },
        data: {
          jwtId: null,
        },
      });

      const nextResponse: NextResponse = NextResponse.json({ message: "Successful!" }, { status: 200 });
      nextResponse.cookies.delete("ejwt");

      return nextResponse;
    }

    return NextResponse.json({ message: "Successful logout!" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}