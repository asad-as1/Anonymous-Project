const { Question, Answer } = require('../models/QnA');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

    await User.findByIdAndUpdate(req.user.id, { $push: { questions: question._id } });

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
    await User.findByIdAndUpdate(req.user.id, { $push: { answers: answer._id } });

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


exports.deleteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const answer = await Answer.findByIdAndDelete(answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    
    if (answer.user.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own answers' });
    }
    
    // Remove the answer from the question
    question.answers.pull(answer._id);
    await question.save();
    
    // Remove the answer reference from the user model
    const userAnswerIndex = user.answers.findIndex(
      (ansId) => ansId.toString() === answerId
    );
    // console.log(userAnswerIndex)

    if (userAnswerIndex !== -1) {
      user.answers.splice(userAnswerIndex, 1);
      await user.save();
    }

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateAnswer = async (req, res) => {
  try {
    const { id, answerId } = req.params;
    const { text, token } = req.body;
    // console.log(req.body)

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Answer text cannot be empty.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.userId;
    
    const answer = await Answer.findById(answerId);
    // console.log(answer)
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }

    if (answer.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this answer.' });
    }

    answer.text = text;
    await answer.save();

    return res.status(200).json({ message: 'Answer updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, details, token } = req.body;
    // console.log(req.body)

    if (!title || !details || !title.trim() || !details.trim()) {
      return res.status(400).json({ message: 'Question details or title cannot be empty.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const userId = decoded.userId;
    
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    // console.log(question)
    
    if (question.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this question.' });
    }

    question.title = title;
    question.details = details;
    await question.save();

    return res.status(200).json({ message: 'Question updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Check if the question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Fetch related answer IDs before deleting
    const answersToDelete = await Answer.find({ question: questionId });
    const answerIds = answersToDelete.map((answer) => answer._id);

    // Delete related answers
    await Answer.deleteMany({ question: questionId });

    // Remove question and answer references from users
    await User.updateMany(
      { 
        $or: [
          { questions: questionId }, 
          { answers: { $in: answerIds } }
        ] 
      },
      { 
        $pull: { 
          questions: questionId, 
          answers: { $in: answerIds } 
        } 
      }
    );

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    res.status(200).json({ message: 'Question and associated answers deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


