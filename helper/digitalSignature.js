const fs = require("fs");
const { generateKeyPair } = require("crypto");
const crypto = require("crypto");
const config = require("config");
require("dotenv").config();

var EC = require("elliptic").ec;

// function used to verify signature
function verify(publicKey, file, signature) {
  const doc = fs.readFileSync(file);
  var shaMsgF = crypto
    .createHash(config.get("hashing_function"))
    .update(doc)
    .digest();

  console.log("Verified: " + publicKey.verify(shaMsgF, signature));
}

exports.verify = verify;
