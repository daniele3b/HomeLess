const axios = require("axios");

const config = require("config");

function mine() {
  const options = {
    method: "get",
    url: config.get("currentNodeUrl") + config.get("port") + "/mine",
  };

  axios(options)
    .then(() => {
      console.log("Block Mined! \n");
    })
    .catch((err) => {
      console.log("Error during mine: " + err.response.data);
    });
}

exports.mine = mine;
