import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { HashPassword, GenerateWrappingKey, GenerateKey256Bit, GenerateStoredCiphertext, ParseStoredCiphertext } from "../../../libs/crypto-lib";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const registerData: RegisterData = await nextRequest.json();

    const [hashedPassword, salt] = HashPassword(registerData.password);

    const wrappingKey = GenerateWrappingKey(registerData.password, salt); //used to encrypt/decrypt masterKey

    const masterKey = GenerateKey256Bit().toString('hex'); //used to encrypt/decrypt passwords and notes

    console.log("\n\nmasterKey");
    console.log(masterKey);

    const storedMasterKey = GenerateStoredCiphertext(wrappingKey, masterKey);

    console.log("\n\nstoredMasterKey");
    console.log(storedMasterKey);

    const decryptedMasterKey = ParseStoredCiphertext(wrappingKey, storedMasterKey);

    console.log("\n\ndecryptedMasterKey");
    console.log(decryptedMasterKey);


    /*
    const prisma = new PrismaClient();

    await prisma.login
      .create({
        data: {
          email: registerData.email,
          password: await hash(registerData.password, await genSalt(10)),
          token: AES.encrypt(tokenSecret, process.env.SECRET_KEY!).toString(),
        },
      })
      .then(async (loginData) => {
        await prisma.user.create({
          data: {
            name: registerData.name,
            masterKey: AES.encrypt("", process.env.SECRET_KEY!).toString(),
            loginId: loginData.id,
          },
        });
      });*/

    return NextResponse.json({ message: "TEST" });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
