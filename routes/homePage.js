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

router.get("/it/messageSuccess", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/it", "messageSuccess.html"));
});

router.get("/en/messageSuccess", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views/en", "messageSuccess.html"));
});

module.exports = router;
