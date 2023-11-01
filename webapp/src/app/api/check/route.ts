import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { GetPrismaClient } from "@libs/prisma";
import { Prisma } from "@prisma/client";
import { GenerateRandomKey } from "@libs/crypto";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      console.log("check has jwt");
      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      await GetPrismaClient().login.findUniqueOrThrow({
        where: {
          id: payload.id as number,
          email: payload.email as string,
          jwtId: payload.jwtId as string,
        },
      });

      const newJwtId = GenerateRandomKey();

      await GetPrismaClient().login.update({
        where: {
          id: payload.id as number,
          email: payload.email as string,
        },
        data: {
          jwtId: newJwtId,
        },
      });

      const newEncryptedJwt = await new EncryptJWT({ id: payload.id, email: payload.email, masterKey: payload.masterKey, jwtId: newJwtId })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuer("https://satupassword.com")
        .setAudience("https://satupassword.com")
        .setIssuedAt()
        .setExpirationTime("30m")
        .encrypt(DecodeHex(process.env.SECRET_KEY!));

      return NextResponse.json({ message: "Successful!", newEncryptedJwt: newEncryptedJwt }, { status: 200 });
    }

    console.log("no token??");

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch (exception) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2025") {
        return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
      }
    }

    console.log(exception);

    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
