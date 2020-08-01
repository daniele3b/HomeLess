const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

const Cryptr = require("cryptr");

function cipherSym(data) {
  const cryptr = new Cryptr(process.env.PW_CIPHER);
  const encryptedString = cryptr.encrypt(JSON.stringify(data));
  return encryptedString;
}

exports.cipherSym = cipherSym;
