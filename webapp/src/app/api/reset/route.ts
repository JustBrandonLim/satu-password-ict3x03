import { NextRequest, NextResponse } from "next/server";
import prisma from "@libs/prisma";
import { authenticator } from "otplib";
import logger from "@libs/logger";
interface ResetData {
  email: string;
  password: string;
  otp: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const resetData: ResetData = await nextRequest.json();

    const login = await prisma.login.findUniqueOrThrow({
      where: {
        email: resetData.email,
      },
    });

    if (authenticator.check(resetData.otp, login.totpSecret)) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          loginId: login.id,
        },
      });

      await prisma.login.delete({
        where: {
          email: resetData.email,
        },
      });

      const checkResponse = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          email: resetData.email,
          password: resetData.password,
        }),
      });

      if (checkResponse.ok) {
        const checkResponseData = await checkResponse.json();

        logger.info(
          `User: ${resetData.email} Message: Account Reset Successful`
        );
        return NextResponse.json(
          { message: "Successful!", otpUrl: checkResponseData.otpUrl },
          { status: 200 }
        );
      } else {
        logger.info(
          `User: ${resetData.email} Message: Register for Account Reset fail`
        );
        return NextResponse.json(
          { message: "Something went wrong!" },
          { status: 400 }
        );
      }
    }

    logger.info(
      `User: ${resetData.email} Action :AccountReset Message:Incorrect email or otp`
    );
    return NextResponse.json(
      { message: "Incorrect email or otp!" },
      { status: 400 }
    );
  } catch {
    logger.info(`Action :AccountReset Message: Internal Server Error`);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
