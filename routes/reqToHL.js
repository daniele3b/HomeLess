const express = require('express')
const router = express.Router()

router.post('/', async (req,res) => {
    const {error} = validate(req.body)
    if (error)  return res.status(400).send(error.details[0].message)
    res.send('box')
})

module.exports = router