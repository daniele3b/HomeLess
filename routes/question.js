const { QuestionService2 } = require("../models/questionService2");
const express = require("express");
const router = express.Router();
const {
  removeQuestionService2,
  getTree,
  getPath,
} = require("../helper/utilitiesDB");

router.get("/getQuestion/:question_id/:service/:language", async (req, res) => {
  const question_id = req.params.question_id;
  const service = req.params.service;
  const language = req.params.language;

  if (question_id.length < 6 || question_id.length > 7)
    return res.status(400).send("Invalid question id.");
  if (language.length != 3) return res.status(400).send("Invalid language.");

  if (service == "2") {
    let question = await QuestionService2.find({
      question_id: question_id,
      language: language,
    });

    if (question.length == 0)
      return res.status(404).send("Question with the given id not found.");

    question = question[0];

    res.status(200).send(question);
  } else {
    res.status(404).send("Service not found!");
  }
});

router.get("/getTreeFrom/:question_id/:service/:language", async (req, res) => {
  const question_id = req.params.question_id;
  const service = req.params.service;
  const language = req.params.language;

  if (question_id.length < 6 || question_id.length > 7)
    return res.status(400).send("Invalid question id.");
  if (language.length != 3) return res.status(400).send("Invalid language.");

  if (service == "2") {
    let question = await QuestionService2.find({
      question_id: question_id,
      language: language,
    });

    if (question.length == 0)
      return res.status(404).send("Question not found!");
    question = question[0];

    getTree(question).then((questions) => {
      res.status(200).send(questions);
    });
  } else {
    res.status(404).send("Service not found!");
  }
});

router.get(
  "/getPath/from/:questionStartId/to/:questionEndId/:service/:language",
  async (req, res) => {
    const questionStartId = req.params.questionStartId;
    const questionEndId = req.params.questionEndId;
    const service = req.params.service;
    const language = req.params.language;

    if (questionStartId.length < 6 || questionStartId.length > 7)
      return res.status(400).send("Invalid question start id.");
    if (questionEndId.length < 6 || questionEndId.length > 7)
      return res.status(400).send("Invalid question end id.");

    if (language.length != 3) return res.status(400).send("Invalid language.");

    if (service == "2") {
      let questionEnd = await QuestionService2.find({
        question_id: questionEndId,
        language: language,
      });
      if (questionEnd.length == 0)
        return res.status(404).send("Question end not found!");

      let questionStart = await QuestionService2.find({
        question_id: questionStartId,
        language: language,
      });
      if (questionStart.length == 0)
        return res.status(404).send("Question start not found!");

      questionStart = questionStart[0];
      questionEnd = questionEnd[0];

      getPath(questionStart, questionEnd).then((path) => {
        if (path.length == 0) return res.status(404).send("Path not found!");

        res.status(200).send(path);
      });
    } else {
      res.status(404).send("Service not found!");
    }
  }
);

router.get("/getRemovableQuestions/:service/:language", async (req, res) => {
  const service = req.params.service;
  const language = req.params.language;

  if (language.length != 3) return res.status(400).send("Invalid language.");

  if (service == "2") {
    const questions = await QuestionService2.find({
      language: language,
      $where: "this.nextQuestions.length > 0",
    });

    if (questions.length == 0)
      return res.status(404).send("No removable questions found.");

    res.status(200).send(questions);
  } else {
    res.status(404).send("Service not found!");
  }
});

router.post("/addQuestion/:service/:language", async (req, res) => {
  const service = req.params.service;

  if (req.params.language.length != 3) return res.status(400).send("Invalid language.");
  /*if(req.body.question_id.length < 6 || req.body.question_id.length > 7)
    return res.status(400).send("Invalid question id.")*/

  const question = {
    question_id: req.body.question_id,
    previousQuestion: req.body.previousQuestion,
    text: req.body.text,
    language: req.body.language,
    template_id: req.body.template_id,
    pathPreviewPdf: req.body.pathPreviewPdf,
    nextQuestions: [],
  };

  if (question.text != "") {
    if(service == "2"){
      const questionInDB = await QuestionService2.find({
        text: question.text,
        language: req.params.language,
      });
  
      if (questionInDB.length > 0)
        return res.status(400).send("Question already exists.");
    }
  }
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
      console.log("LEAF INSERTION!");

      if (req.body.template_id != null) {
        console.log("Looking for duplicated template id");
        let qleaf = await QuestionService2.find({
          language: req.params.language,
          template_id: req.body.template_id,
        });

        if (qleaf.length > 0) {
          console.log("FOUND DUPLICATED TEMPLATE_ID");
          return res.status(400).send("Template already used!");
        }
      }

      previousQuestion[0].nextQuestions.push({
        nextQuestionId: question.question_id,
        answer: answer,
      });

      await QuestionService2.findOneAndUpdate(
        { question_id: previous_id, language: req.params.language },
        {
          nextQuestions: previousQuestion[0].nextQuestions,
          template_id: null,
          pathPreviewPdf: "",
        }
      );

      const qService2 = new QuestionService2(question);
      qService2
        .save()
        .then(() => {
          console.log("INSERTION LEAF OK!");
          return res.status(200).send("Question added!");
        })
        .catch((err) => {
          console.log(err);
          console.log("INSERTION LEAF !OK");
          return res.status(400).send("Bad request leaf!");
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

      console.log(oldRoot);
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
        .catch((err) => {
          console.log(err);
          return res.status(400).send("Bad request root!");
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

      // Avoiding cycles and bad insertions
      if (childrenQuestion[0] == undefined)
        return res.status(400).send("Impossible to create this link.");

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
        .catch(() => res.status(400).send("Bad request middle!"));
    }
  } else res.status(404).send("Service not found!");
});

router.delete(
  "/removeQuestion/:question_id/:service/:language",
  async (req, res) => {
    const question_id = req.params.question_id;
    const service = req.params.service;
    const language = req.params.language;

    if (question_id.length < 6 || question_id.length > 7)
      return res.status(400).send("Invalid question id.");
    if (language.length != 3) return res.status(400).send("Invalid language.");

    if (service == "2") {
      let question = await QuestionService2.find({
        question_id: question_id,
        language: language,
      });

      if (question.length == 0)
        return res
          .status(404)
          .send("Question with the id " + question_id + " not found.");

      question = question[0];

      console.log(question.previousQuestion);
      console.log(language);

      if (question.previousQuestion == null) {
        await QuestionService2.deleteMany({});
        console.log("REMOVED ALL TREE");
        return res
          .status(200)
          .send("Question " + question_id + " and his child removed.");
      }
      let father = await QuestionService2.find({
        question_id: question.previousQuestion,
        language: language,
      });
      father = father[0];
      console.log(father);
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

      removeQuestionService2(question);

      res
        .status(200)
        .send("Question " + question_id + " and his child removed.");
    } else res.status(404).send("Service not found!");
  }
);

router.put(
  "/modifyQuestion/:question_id/:service/:language",
  async (req, res) => {
    const question_id = req.params.question_id;
    const service = req.params.service;
    const language = req.params.language;

    if (question_id.length < 6 || question_id.length > 7)
      return res.status(400).send("Invalid question id.");
    if (language.length != 3) return res.status(400).send("Invalid language.");

    if (service == "2") {
      let question = await QuestionService2.find({
        question_id: question_id,
        language: language,
      });
      if (question.length == 0)
        return res.status(404).send("Question with the given id not found.");

      question = question[0];

      await QuestionService2.findOneAndUpdate(
        { question_id: question_id, language: language },
        {
          text: req.body.text,
          nextQuestions: req.body.nextQuestions,
          template_id: req.body.template_id,
        }
      );

      res.status(200).send("Question " + question_id + " updated!");
    } else {
      res.status(404).send("Service not found!");
    }
  }
);

module.exports = router;
