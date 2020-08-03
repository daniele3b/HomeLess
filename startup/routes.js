const reqToHL1 = require("../routes/reqToHL1");
const reqToHL2 = require("../routes/reqToHL2");
const reqToHL3 = require("../routes/reqToHL3");
const homePage = require("../routes/homePage");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain/networkNode");
const config = require("config");
const verify = require("../routes/verifyDocument");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/", homePage);
  app.use("/", reqToHL1);
  app.use("/", reqToHL2);

  if (config.get("blockChainActive") == "yes") {
    app.use("/", Blockchain);
    app.use("/", verify);
    app.use("/", reqToHL3);
  }
};
