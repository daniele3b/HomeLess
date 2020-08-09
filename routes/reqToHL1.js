const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");

router.post("/en/service1", async (req, res) => {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  const birthday = req.body.birthday.split("-")
  const birthday_day = birthday[2]
  const birthday_month = birthday[1]
  const birthday_year = birthday[0]
  

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthday: birthday_day + "/" + birthday_month + "/" + birthday_year,
    day: gg + mm + aaaa,
    street: req.body.street,
    city: req.body.city,
    cap: req.body.cap,
    to: req.body.to,
    service: "1",
    lang: "eng"
  };

  sendInfoToOneServer(objToSend);

  res.send(objToSend);
});

router.post("/it/service1", async (req, res) => {console.log("sub");
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  const birthday = req.body.birthday.split("-")
  const birthday_day = birthday[2]
  const birthday_month = birthday[1]
  const birthday_year = birthday[0]

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    birthday: birthday_day + "/" + birthday_month + "/" + birthday_year,
    day: gg + mm + aaaa,
    street: req.body.street,
    city: req.body.city,
    cap: req.body.cap,
    to: req.body.to,
    service: "1",
    lang: "ita"
  };

  sendInfoToOneServer(objToSend);

  res.send(objToSend);
});

module.exports = router;
