const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "home.html"));
});

router.get("/service1", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "home1.html"));
});

router.get("/service2", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "home2.html"));
});

router.get("/service3", async (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "home3.html"));
});
module.exports = router;
