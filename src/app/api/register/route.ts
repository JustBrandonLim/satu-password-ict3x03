import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt-ts";
import { PrismaClient } from "@prisma/client/edge";

export const runtime = "edge";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const registerData: RegisterData = await nextRequest.json();

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(registerData.password, passwordSalt);

    const prisma = new PrismaClient();

    const loginData = await prisma.login.create({
      data: {
        email: registerData.email,
        password: passwordHash,
        token: "encryptedToken",
      },
    });

    const userData = await prisma.user.create({
      data: {
        name: registerData.name,
        sessionKey: "encryptedSessionKey",
        masterKey: "PBKDF2",
        loginId: loginData.id,
      },
    });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
