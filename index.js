const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

app.use(cors());
//setting bodyparser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

require("./startup/routes")(app);

const port = process.env.PORT || 8080;
const server = app.listen(8080, () => {
  console.log("Server listening on port : ", port);
});

module.exports = server;
