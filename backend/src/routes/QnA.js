const express = require('express');
const router = express.Router();
const qaController = require('../controllers/QnA.controller');
const { authenticate } = require('../middlewares/auth'); 

// Routes for questions
router.post('/questions', authenticate, qaController.addQuestion);
router.post('/allquestions', authenticate, qaController.getAllQuestions);
router.post('/questions/:questionId', authenticate, qaController.getQuestionById);

// Routes for answers
router.post('/questions/:questionId/answer', authenticate, qaController.addAnswer);

module.exports = router;
