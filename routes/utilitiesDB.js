const express = require("express");
const router = express.Router();
const {QuestionService2} = require("../models/questionService2")

// Get all italian questions for a specific service
router.get("/getQuestionsITA/:service", async (req, res) => {
    const service = req.params.service

    if(service == 2){
        const questions = await QuestionService2.find({language: "ITA"})

        if(questions.length == 0) return res.status(404).send("Italian questions for service "+service+" not found.")

        res.status(200).send(questions)
    }

    else{
        // Holder
        res.status(404).send("Service not found!")
    }
});

// Get all english questions for a specific service
router.get("/getQuestionsENG/:service", async (req, res) => {
    const service = req.params.service

    if(service == 2){
        const questions = await QuestionService2.find({language: "ENG"})

        if(questions.length == 0) return res.status(404).send("English questions for service "+service+" not found.")

        res.status(200).send(questions)
    }

    else{
        // Holder
        res.status(404).send("Service not found!")
    }
});

// Get all arabic questions for a specific service
router.get("/getQuestionsARB/:service", async (req, res) => {
    const service = req.params.service

    if(service == 2){
        const questions = await QuestionService2.find({language: "ARB"})

        if(questions.length == 0) return res.status(404).send("Arabic questions for service "+service+" not found.")

        res.status(200).send(questions)
    }

    else{
        // Holder
        res.status(404).send("Service not found!")
    }
});

module.exports = router;