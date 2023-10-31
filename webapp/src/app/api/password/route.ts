import { NextRequest, NextResponse } from "next/server";
import { GeneratePassword } from "@libs/password";

interface PasswordReqData {
  uppercase: boolean;
  lowercase: boolean;
  numerical: boolean;
  symbols: boolean;
  passwordLength: number;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const generatePasswordReqData: PasswordReqData = await nextRequest.json();
    const uppercase = generatePasswordReqData.uppercase;
    const lowercase = generatePasswordReqData.lowercase;
    const numerical = generatePasswordReqData.numerical;
    const symbols = generatePasswordReqData.symbols;
    const passwordLength = generatePasswordReqData.passwordLength;

    if (!uppercase && !lowercase && !numerical && !symbols) {
      return NextResponse.json({ message: "Please check at least one of the options!" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Successful!", password: GeneratePassword(uppercase, lowercase, numerical, symbols, passwordLength) },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
