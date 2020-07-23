const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");

router.post("/", async (req, res) => {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthday: req.body.day + "/" + req.body.month + "/" + req.body.year,
    day: gg + mm + aaaa,
    street: req.body.street,
    city: req.body.city,
    cap: req.body.cap,
    to: req.body.to,
    service: req.body.service,
  };

  sendInfoToOneServer(objToSend);

  res.send(objToSend);
});

module.exports = router;
