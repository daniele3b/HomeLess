const express = require('express')
const app = express()

require('./startup/routes')(app)


const port = process.env.PORT || 8080
const server = app.listen(8080, () =>  { console.log("Server listening on port : " , port)})


module.exports = server
