const express = require("express");
const router = express.Router();
const { sendInfoToOneServer } = require("../amqp/producer.js");
const axios = require("axios");
const config = require("config");

router.post("/en/service2", async (req, res) => {

  // Check if service is active
  const options = {
    url: config.get("homel_2") + "/getStatusServer",
    method: "get"
  }
  
  axios(options)
  // If service is active
  .then(response => {

    // I create data for amqp producer
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
      lang: "eng",
      template_id: req.body.template_id
    };

    console.log(objToSend)

    // If security is active
    if (config.get("security_active") == "yes") {
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      if (response.data.encoding == "symmetric") publicKeys[0] = "symmetric";

      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingSuccess')
    }

    // If security is not active
    else{
      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingSuccess')
    }   
  })
  
  // If service is not active
  .catch(err => {

    // If security is active
    if(config.get("security_active") == "yes"){
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      console.log(config.get("homel_2") + " is offline!");

      publicKeys[0] = "NA";
    }

    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/en/messageSendingError')
  })

});

router.post("/it/service2", async (req, res) => {
  // Check if service is active
  const options = {
    url: config.get("homel_2") + "/getStatusServer",
    method: "get"
  }
  
  axios(options)
  // If service is active
  .then(response => {

    // I create data for amqp producer
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

    // If security is active
    if (config.get("security_active") == "yes") {
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      if (response.data.encoding == "symmetric") publicKeys[0] = "symmetric";

      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingSuccess')
    }

    // If security is not active
    else{
      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingSuccess')
    }   
  })
  
  // If service is not active
  .catch(err => {

    // If security is active
    if(config.get("security_active") == "yes"){
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      console.log(config.get("homel_2") + " is offline!");

      publicKeys[0] = "NA";
    }

    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/it/messageSendingError')
  })
});

router.post("/arb/service2", async (req, res) => {
  // Check if service is active
  const options = {
    url: config.get("homel_2") + "/getStatusServer",
    method: "get"
  }
  
  axios(options)
  // If service is active
  .then(response => {

    // I create data for amqp producer
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
      lang: "arb"
    };

    // If security is active
    if (config.get("security_active") == "yes") {
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      if (response.data.encoding == "symmetric") publicKeys[0] = "symmetric";

      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/arb/messageSendingSuccess')
    }

    // If security is not active
    else{
      sendInfoToOneServer(objToSend);
      res.redirect(config.get("currentNodeUrl") + config.get("port") +'/arb/messageSendingSuccess')
    }   
  })
  
  // If service is not active
  .catch(err => {

    // If security is active
    if(config.get("security_active") == "yes"){
      
      // Getting publicKeys array
      const { publicKeys } = require("../startup/getPublicKey");

      console.log(config.get("homel_2") + " is offline!");

      publicKeys[0] = "NA";
    }

    res.redirect(config.get("currentNodeUrl") + config.get("port") +'/arb/messageSendingError')
  })
});

module.exports = router;
