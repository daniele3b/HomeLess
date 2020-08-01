const crypto = require("crypto");

function encryptData(data, publicKey) {
    var dataCrypted = crypto.publicEncrypt(
      publicKey,
      Buffer.from(JSON.stringify(data))
    );
    return dataCrypted;
}

exports.encryptData = encryptData