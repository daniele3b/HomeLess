const reqToHL = require('../routes/reqToHL')
const homePage = require('../routes/homePage')
const bodyParser = require('body-parser')

module.exports = function(app) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/', homePage)
    app.use('/', reqToHL)
}