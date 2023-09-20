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

/** @author S0meDev99 */
export function GenerateRandomIv(): string {
  return randomBytes(12).toString("hex");
}

/**
 * @author S0meDev99
 * 
 * @param encryptionKey 256 bits (32 bytes)
 * @param iv 96 bits (12 bytes)
 * @param data plaintext
 * @returns ciphertext and authentication tag
 */
export function Encrypt(encryptionKey: string, iv: string, data: string): [string, string] {
  
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(encryptionKey, 'hex'), Buffer.from(iv, 'hex'));

  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');

  // Get the authentication tag
  const authenticationTag = cipher.getAuthTag().toString('hex');

  return [encryptedData, authenticationTag];
}

/**
 * @author S0meDev99
 * 
 * @param decryptionKey 256 bits (32 bytes)
 * @param iv 96 bits (12 bytes)
 * @param encryptedData ciphertext
 * @param authenticationTag 128 bits (16 bytes)
 * @returns plaintext
 */
export function Decrypt(decryptionKey: string, iv: string, encryptedData: string, authenticationTag: string): string {
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(decryptionKey, 'hex'), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authenticationTag, 'hex'));

  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');

  return decryptedData;
}
