import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { PrismaClient } from "@prisma/client";
import { GenerateRandomKey } from "@libs/crypto-lib";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const prisma = new PrismaClient();

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const loginData = await prisma.login.findUniqueOrThrow({
        where: {
          email: payload.email as string,
          jwtId: payload.jwtId as string,
        },
      });

      const newJwtId = GenerateRandomKey();

      await prisma.login.update({
        where: {
          email: payload.email as string,
        },
        data: {
          jwtId: newJwtId,
        },
      });

      const newEncryptedJwt = await new EncryptJWT({ email: payload.email, masterKey: payload.masterKey, jwtId: newJwtId })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuer("https://satupassword.com")
        .setAudience("https://satupassword.com")
        .setIssuedAt()
        .setExpirationTime("3m")
        .encrypt(DecodeHex(process.env.SECRET_KEY!));

      return NextResponse.json({ message: "Successful check!", newEncryptedJwt: newEncryptedJwt }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  } catch (exception) {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
