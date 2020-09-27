const { QuestionService2 } = require("../models/questionService2");
const express = require("express");
const router = express.Router();
const {
  removeQuestionService2,
  getTree,
  getPath,
} = require("../helper/utilitiesDB");

// Get a question with a specific question_id for a specific service in a specific language
router.get("/getQuestion/:question_id/:service/:language", async (req, res) => {
  const question_id = req.params.question_id;
  const service = req.params.service;
  const language = req.params.language;

  // Validation control for question_id
  const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
  const validQuestion = regex.test(question_id);

  if (!validQuestion) return res.status(400).send("Invalid question id.");

  // Validation control for language
  if (language.length != 3) return res.status(400).send("Invalid language.");

  // Check for the service
  if (service == "2") {
    
    // Query the DB for find that question with the specified id and language
    let question = await QuestionService2.find({
      question_id: question_id,
      language: language,
    });

    // Check if the question exists
    if (question.length == 0)
      return res.status(404).send("Question with the given id not found in DB.");

    question = question[0];

    res.status(200).send(question);
  } 
  
  // Other services or service not found
  else {
    res.status(404).send("Service not found!");
  }
});

// Get the tree or subtree starting from a question with a specific question_id for a specific service 
// in a specific language
router.get("/getTreeFrom/:question_id/:service/:language", async (req, res) => {
  const question_id = req.params.question_id;
  const service = req.params.service;
  const language = req.params.language;

  // Validation control for question_id
  const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
  const validQuestion = regex.test(question_id);

  if (!validQuestion) return res.status(400).send("Invalid question id.");

  // Validation control for language
  if (language.length != 3) return res.status(400).send("Invalid language.");

  // Check for the service
  if (service == "2") {

    // Query the DB for find the starting question with the specified id and language
    let question = await QuestionService2.find({
      question_id: question_id,
      language: language,
    });

    // Check if the question exists
    if (question.length == 0)
      return res.status(404).send("Question with the given id not found in DB.");
    question = question[0];

    // If question with the given question_id exists, I can get the tree starting from that question
    // (For details see getTree function in the helper folder / utilitiesDB.js file)
    getTree(question).then((questions) => {
      res.status(200).send(questions);
    });
  } 

  // Other services or service not found
  else {
    res.status(404).send("Service not found!");
  }
});

// Get the path starting from a question with a specific questionStartId to a question with a specific questionEndId 
// for a specific service in a specific language
router.get(
  "/getPath/from/:questionStartId/to/:questionEndId/:service/:language",
  async (req, res) => {
    const questionStartId = req.params.questionStartId;
    const questionEndId = req.params.questionEndId;
    const service = req.params.service;
    const language = req.params.language;

    // Validation control for questionStartId
    const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
    const validQuestionStart = regex.test(questionStartId);

    if (!validQuestionStart)
      return res.status(400).send("Invalid question start id.");

    // Validation control for questionEndId
    const validQuestionEnd = regex.test(questionEndId);

    if (!validQuestionEnd)
      return res.status(400).send("Invalid question end id.");

    // Validation control for language
    if (language.length != 3) return res.status(400).send("Invalid language.");

    // Check for the service
    if (service == "2") {

      // Query the DB for find the end question with the specified id and language
      let questionEnd = await QuestionService2.find({
        question_id: questionEndId,
        language: language,
      });

      // Check if the end question exists
      if (questionEnd.length == 0)
        return res.status(404).send("Question end with the given id not found in DB.");

      // Query the DB for find the start question with the specified id and language
      let questionStart = await QuestionService2.find({
        question_id: questionStartId,
        language: language,
      });

      // Check if the start question exists
      if (questionStart.length == 0)
        return res.status(404).send("Question start with the given id not found in DB.");

      questionStart = questionStart[0];
      questionEnd = questionEnd[0];

      // If both questions exist, I can get the path starting from that start question and ending to that ending question
      // if the path exists.
      // (For details see getPath function in the helper folder / utilitiesDB.js file)
      getPath(questionStart, questionEnd).then((path) => {

        // Check if the path was found
        if (path.length == 0) return res.status(404).send("Path not found!");

        res.status(200).send(path);
      });
    } 
    
    // Other services or service not found
    else {
      res.status(404).send("Service not found!");
    }
  }
);

// Get all removable questions for a tree of a specific service in a specific language
router.get("/getRemovableQuestions/:service/:language", async (req, res) => {
  const service = req.params.service;
  const language = req.params.language;

  // Validation control for language
  if (language.length != 3) return res.status(400).send("Invalid language.");

  // Check for the service
  if (service == "2") {

    // Query the DB to find all removable questions, which are all questions that have at least one son.
    const questions = await QuestionService2.find({
      language: language,
      $where: "this.nextQuestions.length > 0",
    });

    // Check if some removable questions were found
    if (questions.length == 0)
      return res.status(404).send("No removable questions found.");

    res.status(200).send(questions);
  } 
  
  // Other services or service not found
  else {
    res.status(404).send("Service not found!");
  }
});

// Insert a new question for a specific service in a specific language
router.post("/addQuestion/:service/:language", async (req, res) => {
  const service = req.params.service;

  // Validation control for language
  if (req.params.language.length != 3)
    return res.status(400).send("Invalid language.");

  // Validation control for question_id in the body of the request
  const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
  const validQuestion = regex.test(req.body.question_id);

  if (!validQuestion) return res.status(400).send("Invalid question id.");

  // Check if the question with the given question_id in the body of the request and that language is already in DB
  const qInDB = await QuestionService2.find({question_id: req.body.question_id, language: req.params.language})
  if(qInDB.length > 0) return res.status(400).send("Question with the given id already used.")

  // Building the question to save in DB
  const question = {
    question_id: req.body.question_id,
    previousQuestion: req.body.previousQuestion,
    text: req.body.text,
    language: req.body.language,
    template_id: req.body.template_id,
    pathPreviewPdf: req.body.pathPreviewPdf,
    nextQuestions: [],
  };

  // Check if the question with the given text in the body of the request and that language is already in DB
  if (question.text != "") {
    if (service == "2") {
      const questionInDB = await QuestionService2.find({
        text: question.text,
        language: req.params.language,
      });

      if (questionInDB.length > 0)
        return res.status(400).send("Question with the same text already exists.");
    }
  }

  // Getting question_id of children question and answer to reach it in the body of the request
  const nextQuestion_id = req.body.nextQuestion;
  const answer = req.body.answer;

  if (service == "2") {
    // Getting father question_id
    let previous_id = question.previousQuestion;

    // Getting father question
    let previousQuestion = await QuestionService2.find({
      question_id: previous_id,
      language: req.params.language,
    });
    
    // Adding the first question of the tree
    if (nextQuestion_id == "NaN" && req.body.previousQuestion == "NaN") {
      
      // Setting the previous question to null
      question.previousQuestion = null;

      // Saving the question into DB 
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

    // Adding a leaf question
    else if (nextQuestion_id == "NaN") {
      const validPreviousQuestion = regex.test(req.body.previousQuestion);

      // Validation control for previous question id in the body of the request
      if (!validPreviousQuestion)
        return res.status(400).send("Invalid previous question id.");

      // Query the DB to check if the previous question with the previous question id in the body of the request exists
      const prevNotInDB = await QuestionService2.find({question_id: req.body.previousQuestion, language: req.params.language})
      if(prevNotInDB.length == 0) return res.status(404).send("Previous question with the given id not found in DB.")

      // If template_id is specified, I have to check if there is already a question with that template_id 
      // for that language
      if (req.body.template_id != null) {
        let qleaf = await QuestionService2.find({
          language: req.params.language,
          template_id: req.body.template_id,
        });

        if (qleaf.length > 0) {
          return res.status(400).send("Template already used!");
        }
      }

      // Father gets his new child
      previousQuestion[0].nextQuestions.push({
        nextQuestionId: question.question_id,
        answer: answer,
      });

      // Update father in DB resetting template_id, pathPreviewPdf and nextQuestions
      await QuestionService2.findOneAndUpdate(
        { question_id: previous_id, language: req.params.language },
        {
          nextQuestions: previousQuestion[0].nextQuestions,
          template_id: null,
          pathPreviewPdf: "",
        }
      );
      
      // Saving the question into DB
      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          return res.status(200).send("Question added!");
        })
        .catch((err) => {
          return res.status(400).send("Bad request leaf!");
        });
    }

    // Adding a new root
    else if (req.body.previousQuestion == "NaN") {

      // Updating the old root setting his previousQuestion to the id of the new question, and getting the result
      // in a constant
      const oldRoot = await QuestionService2.findOneAndUpdate(
        {
          previousQuestion: null,
          language: req.params.language,
        },
        { previousQuestion: question.question_id }
      );
      
      // Setting nextQuestions of the new question to an array that contains only the old root with the anser to reach
      // the old root
      question.nextQuestions = [
        { nextQuestionId: oldRoot.question_id, answer: answer },
      ];

      // Setting the previous question of the new question to null
      question.previousQuestion = null;

      // Saving question into DB
      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          return res.status(200).send("Question added!");
        })
        .catch((err) => {
          return res.status(400).send("Bad request root!");
        });
    }
    
    // Adding in the middle
    else {

      // Validation control for previous question id in the body of the request
      const validPreviousQuestion = regex.test(req.body.previousQuestion);
      if (!validPreviousQuestion)
        return res.status(400).send("Invalid previous question id.");

      // Validation control for next question id in the body of the request
      const validNextQuestion = regex.test(req.body.nextQuestion);
      if (!validNextQuestion)
        return res.status(400).send("Invalid next question id.");

      // Query the DB to check if the previous question with the previous question id in the body of the request
      // and the specified language is found
      const prevNotInDB = await QuestionService2.find({question_id: req.body.previousQuestion, language: req.params.language})
      if(prevNotInDB.length == 0) return res.status(404).send("Previous question with the given id not found in DB.")

      // Query the DB to check if the next question with the next question id in the body of the request
      // and the specified language is found
      const nextNotInDB = await QuestionService2.find({question_id: req.body.nextQuestion, language: req.params.language})
      if(nextNotInDB.length == 0) return res.status(404).send("Next question with the given id not found in DB.")

      // Filtering the next question in nextQuestions' array of the father 
      const childrenQuestion = previousQuestion[0].nextQuestions.filter(
        (obj) => {
          if (obj.nextQuestionId == nextQuestion_id) {
            return obj;
          }
        }
      );

      // If I don't find it, I can avoid cycles and bad insertions
      if (childrenQuestion[0] == undefined)
        return res.status(400).send("Impossible to create this link.");

      // Adding father's child found to new question
      question.nextQuestions = [
        {
          nextQuestionId: childrenQuestion[0].nextQuestionId,
          answer: childrenQuestion[0].answer,
        },
      ];

      // Updating previousQuestion on child with new question
      await QuestionService2.findOneAndUpdate(
        { question_id: childrenQuestion[0].nextQuestionId },
        { previousQuestion: question.question_id }
      );

      // Replacing old child with new child in father
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

      // Updating father with correct children
      await QuestionService2.findOneAndUpdate(
        { question_id: previous_id },
        { nextQuestions: previousQuestion[0].nextQuestions }
      );
      
      // Saving question into DB
      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => res.status(200).send("Question added!"))
        .catch(() => res.status(400).send("Bad request middle!"));
    }
  }
  
  // Other services or service not found
  else res.status(404).send("Service not found!");
});

// Delete all subtree starting from a question with a specific question_id for a specific service in a specific language
router.delete(
  "/removeQuestion/:question_id/:service/:language",
  async (req, res) => {
    const question_id = req.params.question_id;
    const service = req.params.service;
    const language = req.params.language;

    // Validation control for question_id
    const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
    const validQuestion = regex.test(question_id);

    if (!validQuestion) return res.status(400).send("Invalid question id.");

    // Validation control for language
    if (language.length != 3) return res.status(400).send("Invalid language.");

    // Check for the service
    if (service == "2") {

      // Quesry the DB for check if the question with the given question_id exists 
      let question = await QuestionService2.find({
        question_id: question_id,
        language: language,
      });

      if (question.length == 0)
        return res
          .status(404)
          .send("Question with the id " + question_id + " not found.");

      question = question[0];

      // If the question is the root question, I can delete manually all tree
      if (question.previousQuestion == null) {
        await QuestionService2.deleteMany({});
        return res
          .status(200)
          .send("Question " + question_id + " and his child removed.");
      }

      // Getting father
      let father = await QuestionService2.find({
        question_id: question.previousQuestion,
        language: language,
      });
      father = father[0];

      // Removing the child question with the given question_id from father nextQuestions' array
      const newChildren = [];
      let i;
      const dim = father.nextQuestions.length;

      for (i = 0; i < dim; i++) {
        if (father.nextQuestions[i].nextQuestionId != question_id)
          newChildren.push(father.nextQuestions[i]);
      }

      await QuestionService2.findOneAndUpdate(
        { question_id: question.previousQuestion, language: language },
        { nextQuestions: newChildren }
      );
      
      // Removing the subtree (For details see removeQuestionService2 function in the helper folder / utilitiesDB.js file)
      removeQuestionService2(question);

      res
        .status(200)
        .send("Question " + question_id + " and his child removed.");
    } 
    
    // Other services or service not found
    else res.status(404).send("Service not found!");
  }
);

// Modify a question with a specified question_id for a specified service in a specified language
router.put(
  "/modifyQuestion/:question_id/:service/:language",
  async (req, res) => {
    const question_id = req.params.question_id;
    const service = req.params.service;
    const language = req.params.language;

    // Validation control for question_id
    const regex = /Q[1-9]{1}[0-9]?_((ENG)|(ITA)|(ARB))$/;
    const validQuestion = regex.test(question_id);

    if (!validQuestion) return res.status(400).send("Invalid question id.");

    // Validation control for language
    if (language.length != 3) return res.status(400).send("Invalid language.");

    // Checking if a question with the given text and language in the body of the request already exists
    if (req.body.text != "") {
      if (service == "2") {
        const questionInDB = await QuestionService2.find({
          text: req.body.text,
          language: req.params.language,
        });

        if (questionInDB.length > 0 && questionInDB[0].question_id != question_id)
          return res.status(400).send("Question with the same text already exists.");
      }
    }

    // Check for the service
    if (service == "2") {

      // Query the DB to check if the question with the given id and language exists
      let question = await QuestionService2.find({
        question_id: question_id,
        language: language,
      });
      if (question.length == 0)
        return res.status(404).send("Question with the given id not found.");

      question = question[0];

      // Update the question with given text, nextQuestions, template_id and pathPreviewPdf in the body of the request
      await QuestionService2.findOneAndUpdate(
        { question_id: question_id, language: language },
        {
          text: req.body.text,
          nextQuestions: req.body.nextQuestions,
          template_id: req.body.template_id,
          pathPreviewPdf: req.body.pathPreviewPdf
        }
      );

      res.status(200).send("Question " + question_id + " updated!");
    } 
    
    // Other services or service not found
    else {
      res.status(404).send("Service not found!");
    }
  }
);

module.exports = router;
