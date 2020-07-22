const express = require('express')
const router = express.Router()

router.get('/', async (req,res) => {
    res.sendFile(__dirname + "/home.html");
})

module.exports = router