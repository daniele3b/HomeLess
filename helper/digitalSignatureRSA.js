const fs = require("fs");
const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

function verifyHashRSA(publicKey, file, signature) {
  const doc = fs.readFileSync(file);
  console.log("DIO CANE");

  const isVerified = crypto.verify(
    "sha256",
    Buffer.from(doc),
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    signature
  );

  console.log(isVerified);
  return isVerified;
}

exports.verifyHashRSA = verifyHashRSA;
