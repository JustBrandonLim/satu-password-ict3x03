// noinspection SpellCheckingInspection

import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt, EncryptJWT } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { HashPassword, GenerateNewWrappingKey, EncryptAES } from "@libs/crypto";
import prisma from "@libs/prisma";
import logger from "@libs/logger";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;
    if (encryptedJwt !== undefined) {
      const { payload } = await jwtDecrypt(
        encryptedJwt,
        DecodeHex(process.env.SECRET_KEY!),
        {
          issuer: "https://satupassword.com",
          audience: "https://satupassword.com",
        }
      );

      const login = await prisma.login.findUniqueOrThrow({
        where: {
          id: payload.id as number,
        },
      });

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          loginId: payload.id as number,
        },
      });

      logger.info(
        `User: ${payload.email} Action: RetrieveProfile Message: Profile Retrieved Sucessfully.`
      );
      return NextResponse.json(
        {
          message: "Successful!",
          profile: { id: login.id, email: login.email, name: user.name },
        },
        { status: 200 }
      );
    }
    logger.info(
      `Action :RetrieveProfile Message: No JWT Token. Profile Retrieve not successful.`
    );
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :RetrieveProfile Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

interface ProfileUpdateData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const profileUpdateData: ProfileUpdateData = await nextRequest.json();

      const { payload, protectedHeader } = await jwtDecrypt(
        encryptedJwt,
        DecodeHex(process.env.SECRET_KEY!),
        {
          issuer: "https://satupassword.com",
          audience: "https://satupassword.com",
        }
      );

      const [hashedPassword, hashedPasswordSalt] = HashPassword(
        profileUpdateData.password
      );

      await prisma.login.update({
        where: {
          id: payload.id as number,
        },
        data: {
          email: profileUpdateData.email,
          hashedPassword: hashedPassword,
          hashedPasswordSalt: hashedPasswordSalt,
        },
      });

      const [wrappingKey, wrappingKeySalt] = GenerateNewWrappingKey(
        profileUpdateData.password
      );
      const encryptedMasterKey = EncryptAES(
        payload.masterKey as string,
        wrappingKey
      );

      await prisma.user.update({
        where: {
          loginId: payload.id as number,
        },
        data: {
          name: profileUpdateData.name,
          encryptedMasterKey: encryptedMasterKey,
          wrappingKeySalt: wrappingKeySalt,
        },
      });

      const newEncryptedJwt = await new EncryptJWT({
        id: payload.id as number,
        email: profileUpdateData.email,
        masterKey: payload.masterKey,
        jwtId: payload.jwtId,
      })
        .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
        .setIssuer("https://satupassword.com")
        .setAudience("https://satupassword.com")
        .setIssuedAt()
        .setExpirationTime("3m")
        .encrypt(DecodeHex(process.env.SECRET_KEY!));

      const nextResponse: NextResponse = NextResponse.json(
        { message: "Successful!" },
        { status: 200 }
      );
      nextResponse.cookies.set("encryptedjwt", newEncryptedJwt, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });

      logger.info(
        `User: ${payload.id} Action: UpdateProfile Message: Profile Updated Sucessfully.`
      );
      return nextResponse;
    }

    logger.info(
      `Action :UpdateProfile Message: No JWT Token. Profile Update not successful.`
    );
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :UpdateProfile Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload } = await jwtDecrypt(
        encryptedJwt,
        DecodeHex(process.env.SECRET_KEY!),
        {
          issuer: "https://satupassword.com",
          audience: "https://satupassword.com",
        }
      );

      await prisma.login.delete({
        where: {
          id: payload.id as number,
        },
      });

      logger.info(
        `User: ${payload.id} Action: DeleteProfile Message: Profile Deleted Sucessfully.`
      );
      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :DeleteProfile Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
