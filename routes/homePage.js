const express = require('express')
const router = express.Router()

router.get('/', async (req,res) => {
    res.sendFile(__dirname + "/home.html");
})

router.get('/service1', async (req,res) => {
    res.sendFile(__dirname + "/home1.html");
})

router.get('/service2', async (req,res) => {
    res.sendFile(__dirname + "/home2.html");
})

module.exports = router