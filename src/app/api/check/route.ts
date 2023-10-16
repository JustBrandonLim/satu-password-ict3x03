import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { PrismaClient, Prisma } from "@prisma/client";
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

      await prisma.login.findUniqueOrThrow({
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

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch (exception) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2025") {
        return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
