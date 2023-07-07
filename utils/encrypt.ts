// Encrypt-Decrypt
import CryptoJS from 'crypto-js';
var salt = CryptoJS.lib.WordArray.random(128 / 8);

// PBKDF2 is a password-based key derivation function. In many applications of
// cryptography, user security is ultimately dependent on a password, and 
// because a password usually can't be used directly as a cryptographic key,
// some processing is required.

export default function PBKDF2(text) {
    return CryptoJS.PBKDF2(text, salt, {
        keySize: 512 / 32
    }).toString();
}