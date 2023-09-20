import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from "crypto";

/** @author JustBrandonLim */
export function HashPassword(password: string): [string, string] {
  const salt = randomBytes(32).toString("hex");

  const hashedPassword = pbkdf2Sync(password, salt, 10000, 32, "sha512").toString("hex");

  return [hashedPassword, salt];
}

/** @author JustBrandonLim */
export function VerifyPassword(password: string, salt: string, hashedPassword: string): boolean {
  return pbkdf2Sync(password, salt, 30000, 32, "SHA512").toString("hex") === hashedPassword;
}

/** @author JustBrandonLim */
export function GenerateWrappingKey(password: string, salt: string): string {
  return pbkdf2Sync(password, salt, 15000, 32, "SHA512").toString("hex");
}

/** @author JustBrandonLim */
export function GenerateRandomKey(): string {
  return randomBytes(32).toString("hex");
}

export function Encrypt(data: string, key: string): string {
  return "";
}

export function Decrypt(encryptedData: string, key: string): string {
  return "";
}
