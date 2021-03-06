const express = require("express");
const app = express();
var cors = require("cors");
const config = require("config");
const { getPublicKeys } = require("./startup/getPublicKey");
require("dotenv").config()
app.use(cors());

require("./startup/db")();

if (config.get("security_active") == "yes" && process.env.NODE_ENV != "test") {
  getPublicKeys();
}

if (config.get("blockChainActive") == "yes" && process.env.NODE_ENV != "test") {
  const { mine } = require("./helper/mine");

  var bodyParser = require("body-parser");
  //setting bodyparser
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    })
  );

  //set time mine
  setInterval(() => {
    mine();
  }, config.get("time_mine"));
}

require("./startup/routes")(app);

const port = config.get("port");

const server = app.listen(port, () => {
  console.log("Server listening on port : ", port);
});

module.exports = server;
