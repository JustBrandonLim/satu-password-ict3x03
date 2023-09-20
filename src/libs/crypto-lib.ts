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
export function GenerateWrappingKey(password: string, salt: string): Buffer {
  return pbkdf2Sync(password, salt, 15000, 32, "SHA512");
}

/**
 * @author S0meDev99
 * 
 * @param encryptionKey 256 bits (32 bytes)
 * @param plaintext 
 * @returns ciphertext
 */
export function GenerateStoredCiphertext(encryptionKey: Buffer, plaintext: string): string {
  const [encryptedContent, iv, authenticationTag] = _Encrypt(encryptionKey, plaintext);

  const storedCiphertext = ConvertToBase64(encryptedContent) + "." + ConvertToBase64(iv) + "." + ConvertToBase64(authenticationTag);
  return storedCiphertext;
}

/**
 * @author S0meDev99
 * 
 * @param decryptionKey 256 bits (32 bytes)
 * @param storedCiphertext 
 * @returns plaintext or null
 */
export function ParseStoredCiphertext(decryptionKey: Buffer, storedCiphertext: string): string | null {
  const components = storedCiphertext.split('.');
  if (components.length === 3) {
    const encryptedContent = ConvertFromBase64(components[0]);
    const iv = ConvertFromBase64(components[1]);
    const authenticationTag = ConvertFromBase64(components[2]);

    const decryptedData = _Decrypt(decryptionKey, encryptedContent, iv, authenticationTag);

    return decryptedData;
  } else {
    console.error('Invalid storedCiphertext format. Expected three components separated by periods.');

    return null;
  }
}

/**
 * @author S0meDev99
 * 
 * @param encryptionKey 256 bits (32 bytes)
 * @param iv 96 bits (12 bytes)
 * @param data plaintext
 * @returns ciphertext and authentication tag
 */
function _Encrypt(encryptionKey: Buffer, data: string): [Buffer, Buffer, Buffer] {
  const iv = _GenerateAESIv();
  
  const cipher = createCipheriv('aes-256-gcm', encryptionKey, iv);

  let encryptedData = cipher.update(data, "utf-8");
  encryptedData = Buffer.concat([encryptedData, cipher.final()]);;

  // Get the authentication tag
  const authenticationTag = cipher.getAuthTag();

  return [encryptedData, iv, authenticationTag];
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
function _Decrypt(decryptionKey: Buffer, encryptedData: Buffer, iv: Buffer, authenticationTag: Buffer): string {
  const decipher = createDecipheriv('aes-256-gcm', decryptionKey, iv);
  decipher.setAuthTag(authenticationTag);

  let decryptedData = decipher.update(encryptedData);
  decryptedData = Buffer.concat([decryptedData, decipher.final()]);;

  return decryptedData.toString('utf-8');
}

/** @author JustBrandonLim */
export function GenerateKey256Bit(): Buffer {
  return randomBytes(32);
}

/** @author S0meDev99 */
function _GenerateAESIv(): Buffer {
  return randomBytes(12);
}

/** @author S0meDev99 */
export function ConvertToBase64(plainBuffer: Buffer): string {
  return plainBuffer.toString('base64');
}

/** @author S0meDev99 */
export function ConvertFromBase64(encodedString: string): Buffer {
  return Buffer.from(encodedString, 'base64');;
}