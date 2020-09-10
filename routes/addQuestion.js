const { QuestionService2 } = require("../models/questionService2");
const express = require("express");
const router = express.Router();

router.post("/addQuestion/:service/:language", async (req, res) => {
  const service = req.params.service;
  const question = {
    question_id: req.body.question_id,
    previousQuestion: req.body.previousQuestion,
    text: req.body.text,
    language: req.body.language,
    template_id: req.body.template_id,
    nextQuestions: [],
  };

  //Getting question_id of children question and answer to reach it
  const nextQuestion_id = req.body.nextQuestion;
  const answer = req.body.answer;

  console.log("STARTING QUESTION:" + question);
  console.log("NEXT:" + nextQuestion_id);

  if (service == "2") {
    //Getting father question_id
    let previous_id = question.previousQuestion;

    //Getting father question
    let previousQuestion = await QuestionService2.find({
      question_id: previous_id,
      language: req.params.language,
    });

    console.log("FATHER" + previousQuestion);

    if (nextQuestion_id == "NaN" && req.body.previousQuestion == "NaN") {
      question.previousQuestion = null;

      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          return res.status(200).send("Question added!");
        })
        .catch(() => {
          return res.status(400).send("[First node] Bad request!");
        });
    }

    // adding a leaf question
    else if (nextQuestion_id == "NaN") {
      previousQuestion[0].nextQuestions.push({
        nextQuestionId: question.question_id,
        answer: answer,
      });

      await QuestionService2.findOneAndUpdate(
        { question_id: previous_id, language: req.params.language },
        { nextQuestions: previousQuestion[0].nextQuestions, template_id: null }
      );

      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          return res.status(200).send("Question added!");
        })
        .catch(() => {
          return res.status(400).send("Bad request!");
        });
    }

    // Adding a new root
    else if (req.body.previousQuestion == "NaN") {
      const oldRoot = await QuestionService2.findOneAndUpdate(
        {
          previousQuestion: null,
          language: req.params.language,
        },
        { previousQuestion: question.question_id }
      );

      question.nextQuestions = [
        { nextQuestionId: oldRoot.question_id, answer: answer },
      ];
      question.previousQuestion = null;

      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          return res.status(200).send("Question added!");
        })
        .catch(() => {
          return res.status(400).send("Bad request!");
        });
    } else {
      //getting children to update from father question
      const childrenQuestion = previousQuestion[0].nextQuestions.filter(
        (obj) => {
          if (obj.nextQuestionId == nextQuestion_id) {
            return obj;
          }
        }
      );

      //Adding father's child found to new question
      question.nextQuestions = [
        {
          nextQuestionId: childrenQuestion[0].nextQuestionId,
          answer: childrenQuestion[0].answer,
        },
      ];

      console.log("CHILDREN ADDED 2 NEW" + question.nextQuestions);

      console.log("CHILDREN ID NEW" + childrenQuestion[0].nextQuestionId);
      //updating previousQuestion on child with new question
      await QuestionService2.findOneAndUpdate(
        { question_id: childrenQuestion[0].nextQuestionId },
        { previousQuestion: question.question_id }
      );

      //Replacing old child with new child in father
      for (let i = 0; i < previousQuestion[0].nextQuestions.length; i++) {
        if (
          previousQuestion[0].nextQuestions[i].nextQuestionId ==
          childrenQuestion[0].nextQuestionId
        ) {
          previousQuestion[0].nextQuestions[i] = {
            nextQuestionId: question.question_id,
            answer: answer,
          };
        }
      }

      console.log(previousQuestion[0].nextQuestions);

      //Updating father with correct children
      await QuestionService2.findOneAndUpdate(
        { question_id: previous_id },
        { nextQuestions: previousQuestion[0].nextQuestions }
      );

      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => res.status(200).send("Question added!"))
        .catch(() => res.status(400).send("Bad request!"));
    }
  } else res.status(404).send("Service not found!");
});

module.exports = router;
