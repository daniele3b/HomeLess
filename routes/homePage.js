const express = require("express");
const router = express.Router();
const config = require("config");
require("dotenv").config();
const path = require("path");

// English

router.get("/en", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "home.html"));
});

router.get("/en/service1", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "home1.html"));
});

router.get("/en/service2", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "home2.html"));
});

router.get("/en/service3", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "home3.html"));
});

router.get("/en/messageSendingSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/en", "messageSendingSuccess.html")
  );
});

router.get("/en/messageSendingError", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "messageSendingError.html"));
});

router.get("/en/messageVerifyDocumentError", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/en", "messageVerifyDocumentError.html")
  );
});

router.get("/en/messageVerifyDocumentSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/en", "messageVerifyDocumentSuccess.html")
  );
});

router.get("/en/service_2/questions_2", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "questions_2.html"));
});

router.get("/en/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "login.html"));
});

router.get("/en/credentialVerification", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "questionManagement.html"));
});

router.post("/en/credentialVerification", async (req, res) => {
  const pw = req.body.password;
  if (pw == process.env.ENG_PW) {
    res.sendFile(
      path.join(__dirname, "../views/en", "questionManagement.html")
    );
  } else {
    res.sendFile(path.join(__dirname, "../views/en", "home.html"));
  }
});

// Italian

router.get("/it", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "home.html"));
});

router.get("/it/service1", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "home1.html"));
});

router.get("/it/service2", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "home2.html"));
});

router.get("/it/service3", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "home3.html"));
});

router.get("/it/messageSendingSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/it", "messageSendingSuccess.html")
  );
});

router.get("/it/messageSendingError", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "messageSendingError.html"));
});

router.get("/it/messageVerifyDocumentError", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/it", "messageVerifyDocumentError.html")
  );
});

router.get("/it/messageVerifyDocumentSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/it", "messageVerifyDocumentSuccess.html")
  );
});

// Arabic

router.get("/arb", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/arb", "home.html"));
});

router.get("/arb/service1", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/arb", "home1.html"));
});

router.get("/arb/service2", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/arb", "home2.html"));
});

router.get("/arb/service3", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/arb", "home3.html"));
});

router.get("/arb/messageSendingSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/arb", "messageSendingSuccess.html")
  );
});

router.get("/arb/messageSendingError", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/arb", "messageSendingError.html")
  );
});

router.get("/arb/messageVerifyDocumentError", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/arb", "messageVerifyDocumentError.html")
  );
});

router.get("/arb/messageVerifyDocumentSuccess", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "../views/arb", "messageVerifyDocumentSuccess.html")
  );
});

module.exports = router;
