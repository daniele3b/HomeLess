const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");

router.post("/service2", async (req, res) => {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    day: req.body.day + "/" + req.body.month + "/" + req.body.year,
    street: req.body.street,
    cash: req.body.cash,
    service: "2",
  };

  sendInfoToOneServer(objToSend);

  res.send(objToSend);
});

module.exports = router;
