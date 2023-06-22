// Encrypt
import Cryptr from 'cryptr'
console.log(process.env['ENCRPT'])
const cryptr = new Cryptr(process.env['ENCRPT']);

export default cryptr;