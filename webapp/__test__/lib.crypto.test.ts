import {
  HashPassword,
  VerifyPassword,
  GenerateNewWrappingKey,
  GenerateWrappingKey,
  GenerateRandomKey,
  EncryptAES,
  DecryptAES,
} from "../libs/crypto.ts";

import { randomBytes } from "crypto";

// Mock randomBytes function
jest.mock("crypto", () => {
  const original = jest.requireActual("crypto");

  return {
    ...original,

    randomBytes: jest.fn(),
  };
});

describe("HashPassword", () => {
  it("should hash the password and return hashed password and salt", () => {
    randomBytes.mockReturnValueOnce(
      Buffer.from(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "hex"
      )
    );

    const password = "password";
    const [hashedPassword, salt] = HashPassword(password);
    expect(hashedPassword).toBe(
      "2e72ea4990d6bc158943e35a308ebeca69ccdc4185aacf48ff01526de79f30b0"
    );
    expect(salt).toBe(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
  });
});

describe("VerifyPassword", () => {
  it("should return true for correct password", () => {
    const password = "password";
    const hashedPassword =
      "2e72ea4990d6bc158943e35a308ebeca69ccdc4185aacf48ff01526de79f30b0";
    const salt =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    const isVerified = VerifyPassword(password, hashedPassword, salt);
    expect(isVerified).toBe(true);
  });

  it("should return false for incorrect password", () => {
    const password = "password123";
    const hashedPassword =
      "2e72ea4990d6bc158943e35a308ebeca69ccdc4185aacf48ff01526de79f30b0";
    const salt =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

    const isVerified = VerifyPassword(password, hashedPassword, salt);
    expect(isVerified).toBe(false);
  });
});

describe("GenerateNewWrappingKey", () => {
  it("should generate wrapping key and salt", () => {
    randomBytes.mockReturnValueOnce(
      Buffer.from(
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        "hex"
      )
    );

    const password = "password";
    const [wrappingKey, salt] = GenerateNewWrappingKey(password);
    expect(wrappingKey).toBe(
      "4febbfbd6ccf4cf0a4a1ff43006e49a76f6eedf494faf3c7afd6695846f6761d"
    );
    expect(salt).toBe(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
  });
});

describe("GenerateWrappingKey", () => {
  it("should generate wrapping key and salt", () => {
    const salt = Buffer.from(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "hex"
    );
    const password = "password";
    const wrappingKey = GenerateWrappingKey(password, salt);
    expect(wrappingKey).toBe(
      "4febbfbd6ccf4cf0a4a1ff43006e49a76f6eedf494faf3c7afd6695846f6761d"
    );
  });
});

describe("EncryptAES and DecryptAES", () => {
  it("should encrypt and decrypt a string successfully", () => {
    const plaintext = "Hello, World!";
    const password = "password";
    const salt = Buffer.from(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "hex"
    );
    randomBytes.mockReturnValueOnce(
      Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaa", "hex")
    );

    const wrappingKey = GenerateWrappingKey(password, salt);
    expect(wrappingKey).toBe(
      "4febbfbd6ccf4cf0a4a1ff43006e49a76f6eedf494faf3c7afd6695846f6761d"
    );

    const output = EncryptAES(plaintext, wrappingKey);
    const splitOutput = output.split(".");
    // IV
    expect(splitOutput[0]).toBe("aaaaaaaaaaaaaaaaaaaaaaaa");
    // encrypted data
    expect(splitOutput[1]).toBe("8979a21214981d7eb2af21828f");
    // authentication tag
    expect(splitOutput[2]).toBe("c72a4c2aba1161508a66bb4baf29b480");

    const decryptedString = DecryptAES(output, wrappingKey);
    expect(decryptedString).toEqual(plaintext);
  });

  it("should encrypt and decrypt a string unsuccessfully with wrong password", () => {
    const plaintext = "Hello, World!";
    const password1 = "password";
    const password2 = "wrongpassword";
    const salt = Buffer.from(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "hex"
    );
    randomBytes.mockReturnValueOnce(
      Buffer.from("aaaaaaaaaaaaaaaaaaaaaaaa", "hex")
    );

    const wrappingKey1 = GenerateWrappingKey(password1, salt);
    expect(wrappingKey1).toBe(
      "4febbfbd6ccf4cf0a4a1ff43006e49a76f6eedf494faf3c7afd6695846f6761d"
    );

    const output = EncryptAES(plaintext, wrappingKey1);
    const splitOutput = output.split(".");
    // IV
    expect(splitOutput[0]).toBe("aaaaaaaaaaaaaaaaaaaaaaaa");
    // encrypted data
    expect(splitOutput[1]).toBe("8979a21214981d7eb2af21828f");
    // authentication tag
    expect(splitOutput[2]).toBe("c72a4c2aba1161508a66bb4baf29b480");

    const wrappingKey2 = GenerateWrappingKey(password2, salt);
    expect(wrappingKey2).toBe(
      "4b495517f69104fb002aac1bcfbf00a1fb78a6a86debd2536d80d9501099877e"
    );

    expect(() => {
      DecryptAES(output, wrappingKey2);
    }).toThrow();
  });
});

// Add similar test cases for GenerateWrappingKey, GenerateRandomKey, EncryptAES, and DecryptAES functions
