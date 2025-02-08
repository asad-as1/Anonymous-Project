const { Question, Answer } = require('../models/QnA');
const User = require('../models/User');

// Add a new question
exports.addQuestion = async (req, res) => {
  try {
    const { title, details } = req.body;
    if (!title || !details) {
        return res.status(400).json({ error: 'Title and details are required.' });
    }
    
    const question = new Question({
        title,
        details,
        user: req?.user?.id, 
    });
    
    // console.log(question)
    await question.save();

    await User.findByIdAndUpdate(req.user._id, { $push: { questions: question._id } });

    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new answer
exports.addAnswer = async (req, res) => {
  try {
    const questionId = req.params?.questionId
    const { text } = req.body;
    
    if (!text || !questionId) {
      return res.status(400).json({ error: 'Text and questionId are required.' });
    }
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }
    
    const answer = new Answer({
      text,
      user: req.user.id,
      question: questionId,
    });
    // console.log(answer)

    await answer.save();

    // Add the answer reference to the question
    question.answers.push(answer._id);
    await question.save();

    // Update the user's answers reference
    await User.findByIdAndUpdate(req.user._id, { $push: { answers: answer._id } });

    res.status(201).json({ message: 'Answer added successfully', answer });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user', 'username fullName')
      .populate('answers');
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific question with answers
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId)
      .populate('user', 'username fullName')
      .populate({
        path: 'answers',
        populate: { path: 'user', select: 'username fullName' },
      });

    if (!question) {
      return res.status(404).json({ error: 'Question not found.' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
