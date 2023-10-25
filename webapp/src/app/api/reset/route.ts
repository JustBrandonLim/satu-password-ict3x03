import { NextRequest, NextResponse } from "next/server";
import { GetPrismaClient } from "@libs/prisma";
import { authenticator } from "otplib";

interface ResetData {
  email: string;
  password: string;
  otp: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const resetData: ResetData = await nextRequest.json();

    const login = await GetPrismaClient().login.findUniqueOrThrow({
      where: {
        email: resetData.email,
      },
    });

    if (authenticator.check(resetData.otp, login.totpSecret)) {
      const user = await GetPrismaClient().user.findUniqueOrThrow({
        where: {
          id: login.id,
        },
      });

      await GetPrismaClient().login.delete({
        where: {
          id: login.id,
        },
      });

      const checkResponse = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, email: resetData.email, password: resetData.password }),
      });

      if (checkResponse.ok) {
        const checkResponseData = await checkResponse.json();

        return NextResponse.json({ message: "Successful!", otpUrl: checkResponseData.otpUrl }, { status: 200 });
      } else {
        return NextResponse.json({ message: "Something went wrong!" }, { status: 400 });
      }
    }

    return NextResponse.json({ message: "Incorrect email or otp!" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
