const fs = require("fs");
const { generateKeyPair } = require("crypto");
const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

var EC = require("elliptic").ec;
var ec = new EC(config.get("ec_curve_name"));
// function used to verify signature
function verifyHash(publicKey, file, signature) {
  const doc = fs.readFileSync(file);
  var shaMsgF = crypto
    .createHash(config.get("hashing_function"))
    .update(doc)
    .digest();

  return publicKey.verify(shaMsgF, signature);
}

exports.verifyHash = verifyHash;
