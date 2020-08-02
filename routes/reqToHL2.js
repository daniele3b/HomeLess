const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");
const axios = require("axios")
const config = require("config")

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

  const options = {
    url: config.get("homel_2")+"/getStatusServer",
    method: "get"
  }

  axios(options)
  .then(response => {
    sendInfoToOneServer(objToSend);
    res.send(objToSend);
  })
  .catch(err => {
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");
      console.log(publicKeys[0])
      
      console.log(config.get("homel_2")+" is offline!")

      publicKeys[0] = "NA"

      res.status(404).send(config.get("homel_2")+" is offline!")
  })
});

module.exports = router;
