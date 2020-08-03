fs = require("fs");

function deletePdf(path) {
  fs.unlinkSync(path);
  console.log("Pdf deleted!");
}

exports.deletePdf = deletePdf;
