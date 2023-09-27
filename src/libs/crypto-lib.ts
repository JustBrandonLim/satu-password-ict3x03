import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { EncodeHex, DecodeHex, EncodeUTF8 } from "@libs/enc-dec-lib";

/**
 * @author JustBrandonLim
 *
 * @param {string} password The password to hash
 * @returns {[string, string]} The hashed password with a length of 256 bits and its salt
 */
export function HashPassword(password: string): [string, string] {
  const salt = randomBytes(32);

  const hashedPassword = pbkdf2Sync(password, salt, 30000, 32, "sha512");

  return [EncodeHex(hashedPassword), EncodeHex(salt)];
}

/**
 * @author JustBrandonLim
 *
 * @param {string} password The password to verify
 * @param {string} hashedPassword The hashed password to verify against
 * @param {string} hashedPasswordSalt The salt of the hashed password
 * @returns {boolean} Whether the password is verified
 */
export function VerifyPassword(password: string, hashedPassword: string, hashedPasswordSalt: string): boolean {
  return EncodeHex(pbkdf2Sync(password, DecodeHex(hashedPasswordSalt), 30000, 32, "sha512")) === hashedPassword;
}

/**
 * @author JustBrandonLim
 *
 * @param {string} password The password to generate the wrapping key from
 * @returns {[string, string]} The generated wrapping key with a length of 256 bits and its salt
 */
export function GenerateWrappingKey(password: string): [string, string] {
  const salt = randomBytes(32);

  const wrappingKey = pbkdf2Sync(password, salt, 15000, 32, "sha512");

  return [EncodeHex(wrappingKey), EncodeHex(salt)];
}

/**
 * @author JustBrandonLim
 *
 * @returns {[string]} A generated random key with a length of 256 bits
 */
export function GenerateRandomKey(): string {
  return EncodeHex(randomBytes(32));
}

/**
 * @author S0meDev99
 * @author JustBrandonLim
 *
 * @param {string} string The string to encrypt
 * @param {string | Buffer} key The key to use for encryption
 * @returns {string} The encrypted string
 */
export function EncryptAES(string: string, key: string | Buffer): string {
  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", typeof key === "string" ? DecodeHex(key as string) : key, iv);

  let encryptedData = cipher.update(string, "utf-8");
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);

  const authenticationTag = cipher.getAuthTag();

  return EncodeHex(iv).concat(".", EncodeHex(encryptedData), ".", EncodeHex(authenticationTag));
}

/**
 * @author S0meDev99
 * @author JustBrandonLim
 *
 * @param {string} string The data to decrypt
 * @param {string | Buffer} key The key to use for decryption
 * @returns {string} The decoded string
 */
export function DecryptAES(string: string, key: string | Buffer): string {
  const data = string.split(".");

  const iv = DecodeHex(data[0]);
  const encryptedData = DecodeHex(data[1]);
  const authenticationTag = DecodeHex(data[2]);

  const decipher = createDecipheriv("aes-256-gcm", typeof key === "string" ? DecodeHex(key as string) : key, iv);

  decipher.setAuthTag(authenticationTag);

  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);

  return EncodeUTF8(decryptedData);
}
