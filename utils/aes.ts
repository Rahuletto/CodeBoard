// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

export function AESEncrypt(text: string): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.ENCRPT
  ).toString();
}

export function AESDecrypt(text: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(text, process.env.KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    const bytes = CryptoJS.AES.decrypt(text, process.env.ENCRPT);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  }
}
