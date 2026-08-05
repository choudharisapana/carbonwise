const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

/**
 * Derives a consistent 32-byte key from ENCRYPTION_KEY env var.
 * Accepts any string length and hashes it to the right size, so a plain
 * passphrase in .env works fine (no need for a precisely 32-byte hex value).
 */
const getKey = () => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('ENCRYPTION_KEY is not set in .env — required to store GitHub tokens securely.');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts a plaintext string. Returns "iv:authTag:ciphertext" (all hex),
 * so it can be stored as a single string field in MongoDB.
 */
const encrypt = (plainText) => {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
};

/**
 * Decrypts a string produced by encrypt().
 */
const decrypt = (encryptedString) => {
  const key = getKey();
  const [ivHex, authTagHex, encryptedHex] = encryptedString.split(':');

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid encrypted string format');
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
};

module.exports = { encrypt, decrypt };
