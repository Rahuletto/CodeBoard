// Encrypt-Decrypt
import CryptoJS from 'crypto-js';

export function AESEncrypt(text) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.NEXT_PUBLIC_ENCRPT
  ).toString();
}

export function AESDecrypt(text) {
  try {
  const bytes = CryptoJS.AES.decrypt(text, process.env.NEXT_PUBLIC_ENCRPT);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch {
    const bytes = CryptoJS.AES.decrypt(text, process.env.NEXT_PUBLIC_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
  }
}
