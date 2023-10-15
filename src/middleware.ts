import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec-lib";
import { PrismaClient, Prisma } from "@prisma/client";
import { GenerateRandomKey } from "@libs/crypto-lib";

export async function middleware(nextRequest: NextRequest) {
  try {
    const prisma = new PrismaClient();

    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    let newEncryptedJwt: string | undefined = undefined;

    if (encryptedJwt !== undefined) {
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

      newEncryptedJwt = await new EncryptJWT({ email: payload.email, masterKey: payload.masterKey, jwtId: newJwtId })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuer("https://satupassword.com")
        .setAudience("https://satupassword.com")
        .setIssuedAt()
        .setExpirationTime("3m")
        .encrypt(DecodeHex(process.env.SECRET_KEY!));
    }

    switch (nextRequest.nextUrl.pathname) {
      case "/":
      case "/register":
        if (newEncryptedJwt !== undefined) {
          const nextResponse: NextResponse = NextResponse.redirect(new URL("/home", nextRequest.url));
          nextResponse.cookies.set("encryptedjwt", newEncryptedJwt);

          return nextResponse;
        }

        return NextResponse.next();
      case "/home":
        if (newEncryptedJwt !== undefined) {
          const nextResponse: NextResponse = NextResponse.next();
          nextResponse.cookies.set("encryptedjwt", newEncryptedJwt);

          return nextResponse;
        }

        return NextResponse.redirect(new URL("/", nextRequest.url));
    }
  } catch (exception) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2025") {
        const nextResponse: NextResponse = NextResponse.redirect(new URL("/", nextRequest.url));
        nextResponse.cookies.delete("encryptedjwt");

        return nextResponse;
      }
    }

    return NextResponse.redirect(new URL("/", nextRequest.url));
  }
}