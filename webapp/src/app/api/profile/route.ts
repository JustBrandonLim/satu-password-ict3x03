// noinspection SpellCheckingInspection

import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import { DecodeHex } from "@libs/enc-dec";
import { HashPassword, GenerateNewWrappingKey, EncryptAES } from "@libs/crypto";
import { GetPrismaClient } from "@libs/prisma";

export async function GET(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;
    if (encryptedJwt !== undefined) {
      const { payload } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
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

      return NextResponse.json({ message: "Successful!", profile: { id: login.id, email: login.email, name: user.name } }, { status: 200 });
    }
    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
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

      const { payload, protectedHeader } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      const [hashedPassword, hashedPasswordSalt] = HashPassword(profileUpdateData.password);

      const login = await GetPrismaClient().login.update({
        where: {
          id: payload.id as number,
        },
        data: {
          email: profileUpdateData.email,
          hashedPassword: hashedPassword,
          hashedPasswordSalt: hashedPasswordSalt,
        },
      });

      const [wrappingKey, wrappingKeySalt] = GenerateNewWrappingKey(profileUpdateData.password);
      const encryptedMasterKey = EncryptAES(payload.masterKey as string, wrappingKey);

      await GetPrismaClient().user.update({
        where: {
          loginId: login.id,
        },
        data: {
          name: profileUpdateData.name,
          encryptedMasterKey: encryptedMasterKey,
          wrappingKeySalt: wrappingKeySalt,
        },
      });

      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}

export async function DELETE(nextRequest: NextRequest) {
  try {
    const encryptedJwt = nextRequest.cookies.get("encryptedjwt")?.value;

    if (encryptedJwt !== undefined) {
      const { payload } = await jwtDecrypt(encryptedJwt, DecodeHex(process.env.SECRET_KEY!), {
        issuer: "https://satupassword.com",
        audience: "https://satupassword.com",
      });

      await GetPrismaClient().login.delete({
        where: {
          id: payload.id as number,
        },
      });

      return NextResponse.json({ message: "Successful!" }, { status: 200 });
    }

    return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
