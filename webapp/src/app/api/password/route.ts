import {NextRequest, NextResponse} from "next/server";
import { GeneratePassword } from "@libs/password";

interface PasswordReqData {
  uppercase: boolean,
  lowercase: boolean,
  numerical: boolean,
  symbols: boolean,
  passwordLength: number,
}

// export async function GET() {
//   try {
//     // Retrieve the request parameters
//     return NextResponse.json({ message: "Successful!", password: GeneratePassword() }, { status: 200 });
//   } catch {
//     return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
//   }
// }

export async function POST(nextRequest: NextRequest) {
  try {
    // Retrieve the request parameters
    const generatePasswordReqData: PasswordReqData = await nextRequest.json();
    const uppercase = generatePasswordReqData.uppercase;
    const lowercase = generatePasswordReqData.lowercase;
    const numerical = generatePasswordReqData.numerical;
    const symbols = generatePasswordReqData.symbols;
    const passwordLength = generatePasswordReqData.passwordLength;

    // Ensure that at least one of the parameters is true. If not, return an error.
    if (!uppercase && !lowercase && !numerical && !symbols) {
        return NextResponse.json({ message: "Please check at least one of the options!" }, { status: 400 });
    }

    return NextResponse.json({ message: "Successful!", password: GeneratePassword(
        uppercase,
        lowercase,
        numerical,
        symbols,
        passwordLength) }, { status: 200 });
    // return NextResponse.json({ message: "API Call Successful!"}, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
