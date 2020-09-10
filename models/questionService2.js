const mongoose = require("mongoose");

const QuestionService2Schema = new mongoose.Schema({
  question_id: {
    type: String, //Q1_ENG or Q2_ITA
    required: true,
    minlength: 6,
    maxlength: 6,
    unique: true,
  },
  text: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  previousQuestion: {
    type: String,
    default: null,
  },
  nextQuestions: {
    type: [{ nextQuestionId: String, answer: String }],
    default: [],
    required: true,
  },
  language: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 3,
  },
});

const QuestionService2 = mongoose.model(
  "QuestionService2",
  QuestionService2Schema
);

exports.QuestionService2 = QuestionService2;
