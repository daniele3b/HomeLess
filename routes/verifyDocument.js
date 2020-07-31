const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
const { verifyHash } = require("../helper/digitalSignature");
var EC = require("elliptic").ec;
var ec = new EC(config.get("ec_curve_name"));

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
  const transaction = await axios(options);

  signature = transaction.data.signature;
  publicKey = transaction.data.publicKey;
  let key = ec.keyFromPublic(publicKey, "hex");
  if (verifyHash(key, path, signature)) res.status(200).send("Pdf is valid!");
  else res.status(400).send("Pdf in not valid!");
});

module.exports = router;
