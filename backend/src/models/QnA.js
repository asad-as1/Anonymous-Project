const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', QuestionSchema);
const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = { Question, Answer };
