const axios = require("axios");
const config = require("config");

let publicKeys = [];

function getPublicKeys() {
  const numberOfServices = config.get("numberOfServices");
  let i;

  const requests = [];

  for (i = 2; i <= numberOfServices; i++) {
    let options = {
      url: config.get("homel_" + i) + "/generatePublicKey",
      method: "get",
    };

    requests.push(axios(options));
  }

  Promise.all(requests)
    .then((response) => {
      let i;
      const dim = response.length;

      for (i = 0; i < dim; i++) {
        publicKeys.push(response[i].data);
      }
    })
    .catch((err) => {
      publicKeys.push("symmetric");
      console.log("Switched to symmetric enc!");
    });
}

exports.getPublicKeys = getPublicKeys;
exports.publicKeys = publicKeys;
