import { NextResponse } from "next/server";
import { GeneratePassword } from "@libs/password";

export async function GET() {
  try {
    return NextResponse.json({ message: "Successful!", password: GeneratePassword() }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
