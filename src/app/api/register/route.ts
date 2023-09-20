import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { HashPassword, GenerateWrappingKey, GenerateRandomKey, EncryptAES, DecryptAES } from "@libs/crypto-lib";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export async function POST(nextRequest: NextRequest) {
  try {
    const registerData: RegisterData = await nextRequest.json();

    const [hashedPassword, hashedPasswordSalt] = HashPassword(registerData.password);

    const [generatedWrappingKey, generatedWrappingKeySalt] = GenerateWrappingKey(registerData.password);

    const key = GenerateRandomKey();

    const encryptedKey = EncryptAES(key, generatedWrappingKey);

    /*const key = GenerateRandomKey();
    console.log("key: " + key);

    const encryptedKey = EncryptAES(key, generatedWrappingKey);
    console.log("encrypted key: " + encryptedKey);

    const decryptedKey = DecryptAES(encryptedKey, generatedWrappingKey);
    console.log("decrypted key: " + decryptedKey);*/

    const prisma = new PrismaClient();

    await prisma.login
      .create({
        data: {
          email: registerData.email,
          password: hashedPassword,
          salt: hashedPasswordSalt,
          token: "test",
        },
      })
      .then(async (loginData) => {
        await prisma.user.create({
          data: {
            name: registerData.name,
            key: encryptedKey,
            salt: generatedWrappingKeySalt,
            loginId: loginData.id,
          },
        });
      });

    return NextResponse.json({ token: "" });
  } catch {
    return NextResponse.json({ message: "Something went wrong!" });
  }
}
