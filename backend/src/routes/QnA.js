const express = require('express');
const router = express.Router();
const qaController = require('../controllers/QnA.controller');
const { authenticate } = require('../middlewares/auth'); 

// Routes for questions
router.post('/questions', authenticate, qaController.addQuestion);
router.post('/allquestions', authenticate, qaController.getAllQuestions);
router.post('/questions/:questionId', authenticate, qaController.getQuestionById);
router.put('/questions/:questionId', authenticate, qaController.updateQuestion);
router.post('/deletequestion/:questionId', authenticate, qaController.deleteQuestion);

// Routes for answers
router.post('/questions/:questionId/answer', authenticate, qaController.addAnswer);
router.post('/questions/:questionId/answer/:answerId', authenticate, qaController.deleteAnswer);
router.put('/questions/:questionId/answer/:answerId', authenticate, qaController.updateAnswer);

module.exports = router;
