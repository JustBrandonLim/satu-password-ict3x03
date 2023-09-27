import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { VerifyPassword } from "@libs/crypto-lib";
import { authenticator } from "otplib";

interface LoginData {
  email: string;
  password: string;
  otp: string;
}

const prisma = new PrismaClient();

export async function POST(nextRequest: NextRequest) {
  try {
    const loginData: LoginData = await nextRequest.json();

    const user = await prisma.login.findUniqueOrThrow({
      where: {
        email: loginData.email,
      },
    });

    if (VerifyPassword(loginData.password, user.hashedPassword, user.hashedPasswordSalt)) {
      if (authenticator.check(loginData.otp, user.totpSecret)) {
        return NextResponse.json({ message: "Succeeded!" });
      }
    }

    return NextResponse.json({ message: "Failed!" });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
