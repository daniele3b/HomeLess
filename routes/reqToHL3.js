const express = require("express");
const router = express.Router();
const axios = require("axios");
const config = require("config");
var multer = require("multer");
const { deletePdf } = require("../helper/pdfDestroyer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/en/service3", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).send("Bad request!");
  }

  //Call the verify service after have uploaded the file

  const options = {
    url: config.get("currentNodeUrl") + config.get("port") + "/verifyDocument",
    method: "post",
    data: {
      pdfId: req.body.pdf_id,
      path: "./uploads/" + file.originalname,
    },
  };
  axios(options)
    .then((val) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageVerifyDocumentSuccess')
    })
    .catch((err) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageVerifyDocumentError')
    });
});

router.post("/it/service3", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).send("Bad request!");
  }

  //Call the verify service after have uploaded the file

  const options = {
    url: config.get("currentNodeUrl") + config.get("port") + "/verifyDocument",
    method: "post",
    data: {
      pdfId: req.body.pdf_id,
      path: "./uploads/" + file.originalname,
    },
  };
  axios(options)
    .then((val) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageVerifyDocumentSuccess')
    })
    .catch((err) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageVerifyDocumentError')
    });
});

router.post("/arb/service3", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    res.status(400).send("Bad request!");
  }

  //Call the verify service after have uploaded the file

  const options = {
    url: config.get("currentNodeUrl") + config.get("port") + "/verifyDocument",
    method: "post",
    data: {
      pdfId: req.body.pdf_id,
      path: "./uploads/" + file.originalname,
    },
  };
  axios(options)
    .then((val) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/arb/messageVerifyDocumentSuccess')
    })
    .catch((err) => {
      deletePdf("./uploads/" + file.originalname);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/arb/messageVerifyDocumentError')
    });
});

module.exports = router;
