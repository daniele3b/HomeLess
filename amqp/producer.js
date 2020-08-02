var amqp = require("amqplib/callback_api");
const config = require("config");
const { encryptData } = require("../helper/encryptData");
const { cipherSym } = require("../helper/encryptSym");
const axios = require("axios")

function sendInfoToOneServer(info) {
  // Getting publicKeys array
  const { publicKeys } = require("../startup/getPublicKey");

  amqp.connect(config.get("amqp_server"), function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      const exchange = config.get("amqp_exchange");

      const service = info.service;

      let dataToSend = {};

      if (service == "1") {
        const day = info.day.split("/");
        const birthday = info.birthday.split("/");
        dataToSend = {
          name: info.name,
          surname: info.surname,
          day: day[0],
          month: day[1],
          year: day[2],
          birthday_day: birthday[0],
          birthday_month: birthday[1],
          birthday_year: birthday[2],
          street: info.street,
          city: info.city,
          cap: info.cap,
          to: info.to,
          email: info.email,
        };
      } else if (service == "2") {
        const day = info.day.split("/");
        dataToSend = {
          name: info.name,
          surname: info.surname,
          day: day[0],
          month: day[1],
          year: day[2],
          street: info.street,
          cash: info.cash,
          email: info.email,
        };

          if (config.get("RSA_encrypted_active") == "yes") {

            if(publicKeys[0] == "NA"){
              publicKeys[0] = "symmetric"
            }

            if (publicKeys[0] != "symmetric")
              dataToSend = encryptData(dataToSend, publicKeys[0]);
            else dataToSend = cipherSym(dataToSend);
          }
        

        
      }
        
        channel.assertExchange(exchange, "direct", {
          durable: false,
        });
  
        channel.publish(
          exchange,
          service,
          Buffer.from(JSON.stringify(dataToSend))
        );
  
        console.log("Info sent to service " + service);

      
    });

    setTimeout(function () {
      connection.close();
    }, 500);
  });
}

exports.sendInfoToOneServer = sendInfoToOneServer;
