// ============================================================================
// FILE: src/common/utils/Encryption.util.ts
// ============================================================================

import crypto from 'crypto';


export class EncryptionHelper {

  public static hash(data: string, salt: string = ''): string {
    return crypto.createHash('sha256').update(data + salt).digest('hex');
  }

  public static encrypt(text: string, key: string, iv?: string): string {
    const initVector = iv || crypto.randomBytes(16).toString('hex').slice(0, 16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), Buffer.from(initVector, 'utf-8'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${initVector}:${encrypted}`;
  }

  public static decrypt(encryptedText: string, key: string): string {
    const [iv, data] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'utf-8'), Buffer.from(iv, 'utf-8'));
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public static generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
  }

  public static hmac(data: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }
}
