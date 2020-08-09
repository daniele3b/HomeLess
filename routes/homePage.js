const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/en", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "home.html"));
});

router.get("/it", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "home.html"));
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
  res.sendFile(path.join(__dirname, "../views/it", "messageSendingSuccess.html"));
});

router.get("/en/messageSendingSuccess", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "messageSendingSuccess.html"));
});

router.get("/en/messageVerifyDocumentError", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "messageVerifyDocumentError.html"));
});

router.get("/it/messageVerifyDocumentError", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "messageVerifyDocumentError.html"));
});

router.get("/en/messageVerifyDocumentSuccess", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "messageVerifyDocumentSuccess.html"));
});

router.get("/it/messageVerifyDocumentSuccess", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "messageVerifyDocumentSuccess.html"));
});

module.exports = router;
