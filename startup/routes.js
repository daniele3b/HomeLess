const reqToHL1 = require("../routes/reqToHL1"); 
const reqToHL2 = require("../routes/reqToHL2");
const reqToHL3 = require("../routes/reqToHL3");
const homePage = require("../routes/homePage");
const indexPage = require("../routes/indexPage");
const bodyParser = require("body-parser");
const Blockchain = require("../blockchain/networkNode");
const config = require("config");
const verify = require("../routes/verifyDocument");
const question = require("../routes/question");
const utilitiesDB = require("../routes/utilitiesDB");

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/", indexPage);
  app.use("/", homePage);
  app.use("/", reqToHL1);
  app.use("/", reqToHL2);
  app.use("/", question);
  app.use("/", utilitiesDB);

  if (config.get("blockChainActive") == "yes") {
    app.use("/", Blockchain);
    app.use("/", verify);
    app.use("/", reqToHL3);
  }
};
