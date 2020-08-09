const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const { verifyHash } = require("../helper/digitalSignature");
var EC = require("elliptic").ec;
var ec = new EC(config.get("ec_curve_name"));
const { verifyHashRSA } = require("../helper/digitalSignatureRSA");

router.post("/verifyDocument", async (req, res) => {
  const pdfId = req.body.pdfId;
  const path = req.body.path;

  const options = {
    url:
      config.get("currentNodeUrl") +
      config.get("port") +
      "/getTransaction/" +
      pdfId,
    method: "get",
  };

  let signature;
  let publicKey;
  axios(options)
    .then((transaction) => {
      signature = transaction.data.signature;
      publicKey = transaction.data.publicKey;

      if (config.get("digital_signature_alg") == "ECDSA") {
        let key = ec.keyFromPublic(publicKey, "hex");
        if (verifyHash(key, path, signature))
          res.status(200).send("Pdf is valid!");
        else res.status(400).send("Pdf is not valid!");
      } else if (config.get("digital_signature_alg") == "RSA") {
        console.log(publicKey);
        if (verifyHashRSA(publicKey, path, signature))
          res.status(200).send("Pdf is valid!");
        else res.status(400).send("Pdf is not valid!");
      }
    })
    .catch((err) => {
      return res.status(404).send("Pdf not found!");
    });
});

module.exports = router;
