const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");
const axios = require("axios");
const config = require("config");

router.post("/en/service2", async (req, res) => {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  const strday = req.body.day.split("-")
    const day = strday[2]
    const month = strday[1]
    const year = strday[0]

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    day: day + "/" + month + "/" + year,
    street: req.body.street,
    cash: req.body.cash,
    service: "2",
    lang: "eng"
  };

  if (config.get("security_active") == "yes") {
    const options = {
      url: config.get("homel_2") + "/getStatusServer",
      method: "get",
    };

    axios(options)
      .then((response) => {
        // Getting publicKeys array
        const { publicKeys } = require("../startup/getPublicKey");

        if (response.data.encoding == "symmetric") publicKeys[0] = "symmetric";

        sendInfoToOneServer(objToSend);
        res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingSuccess')
      })
      .catch((err) => {
        // Getting publicKeys array
        const { publicKeys } = require("../startup/getPublicKey");

        console.log(config.get("homel_2") + " is offline!");

        publicKeys[0] = "NA";

        res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingError')
      });
  } else {
    sendInfoToOneServer(objToSend);
    res.send(objToSend);
  }
});

router.post("/it/service2", async (req, res) => {
  var data = new Date();
  var gg, mm, aaaa;
  gg = data.getDate() + "/";
  mm = data.getMonth() + 1 + "/";
  aaaa = data.getFullYear();

  const strday = req.body.day.split("-")
    const day = strday[2]
    const month = strday[1]
    const year = strday[0]

  var objToSend = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    day: day + "/" + month + "/" + year,
    street: req.body.street,
    cash: req.body.cash,
    service: "2",
    lang: "ita"
  };

  if (config.get("security_active") == "yes") {
    const options = {
      url: config.get("homel_2") + "/getStatusServer",
      method: "get",
    };

    axios(options)
      .then((response) => {
        // Getting publicKeys array
        const { publicKeys } = require("../startup/getPublicKey");

        if (response.data.encoding == "symmetric") publicKeys[0] = "symmetric";

        sendInfoToOneServer(objToSend);
        res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingSuccess')
      })
      .catch((err) => {
        // Getting publicKeys array
        const { publicKeys } = require("../startup/getPublicKey");

        console.log(config.get("homel_2") + " is offline!");

        publicKeys[0] = "NA";

        res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingError')
      });
  } else {
    sendInfoToOneServer(objToSend);
    res.send(objToSend);
  }
});

module.exports = router;
