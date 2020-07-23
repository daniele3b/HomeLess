const reqToHL1 = require('../routes/reqToHL1')
const reqToHL2 = require('../routes/reqToHL2')
const homePage = require('../routes/homePage')
const bodyParser = require('body-parser')

module.exports = function(app) {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/', homePage)
    app.use('/', reqToHL1)
    app.use('/', reqToHL2)
}