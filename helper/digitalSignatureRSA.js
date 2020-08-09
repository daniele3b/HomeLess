const fs = require("fs");
const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

function verifyHashRSA(publicKey, file, signature) {
  const doc = fs.readFileSync(file);

  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(doc);
  verify.end();
  return verify.verify(publicKey, signature, "hex");
}

exports.verifyHashRSA = verifyHashRSA;
