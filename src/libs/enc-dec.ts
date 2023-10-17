/**
 * @author JustBrandonLim
 *
 * @param {Buffer} buffer The buffer to encode
 * @returns {string} The encoded string
 */
export function EncodeHex(buffer: Buffer): string {
  return buffer.toString("hex");
}

/**
 * @author JustBrandonLim
 *
 * @param {string} string The string to decode
 * @returns {Buffer} The decoded buffer
 */
export function DecodeHex(string: string): Buffer {
  return Buffer.from(string, "hex");
}

/**
 * @author JustBrandonLim
 *
 * @param {Buffer} buffer The buffer to encode
 * @returns {string} The encoded string
 */
export function EncodeBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}

/**
 * @author JustBrandonLim
 *
 * @param {string} string The string to decode
 * @returns {Buffer} The decoded buffer
 */
export function DecodeBase64(string: string): Buffer {
  return Buffer.from(string, "base64");
}

/**
 * @author JustBrandonLim
 *
 * @param {Buffer} buffer The buffer to encode
 * @returns {string} The encoded string
 */
export function EncodeUTF8(buffer: Buffer): string {
  return buffer.toString("utf-8");
}

/**
 * @author JustBrandonLim
 *
 * @param {string} string The string to decode
 * @returns {string} The decoded buffer
 */
export function DecodeUTF8(string: string): Buffer {
  return Buffer.from(string, "utf-8");
}
