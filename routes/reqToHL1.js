const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");
const config = require("config")
const axios = require("axios")

router.post("/en/service1", async (req, res) => {

  const options = {
      url: config.get("homel_1") + "/getStatusServer",
      method: "get",
  };
  
  axios(options)
  .then(response => {
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
  
    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingSuccess')
  })
  .catch(err => {
    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingError')
  })

  
});

router.post("/it/service1", async (req, res) => {

  const options = {
    url: config.get("homel_1") + "/getStatusServer",
    method: "get",
  };

  axios(options)
  .then(response => {
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

    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingSuccess')
  })
  .catch(err => {
    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingError')
  })
  
});

router.post("/arb/service1", async (req, res) => {

  const options = {
      url: config.get("homel_1") + "/getStatusServer",
      method: "get",
  };
  
  axios(options)
  .then(response => {
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
      lang: "arb"
    };
  
    sendInfoToOneServer(objToSend);
  
    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingSuccess')
  })
  .catch(err => {
    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingError')
  })

  
});


module.exports = router;
