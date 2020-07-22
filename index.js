const express = require('express')

const app = express()

//const reqToHL = require('/routes/reqToHL')

const port = process.env.PORT || 8080
const server = app.listen(8081, () =>  { console.log("Server listening on port : " , port)})


module.exports = server
