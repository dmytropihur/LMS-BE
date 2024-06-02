const QuizModel = require('../models/Quiz');
const QuizAttemptModel = require('../models/QuizAttempt');

exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await QuizModel.find().populate('lesson', 'title');
    res.status(200).json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching quizzes');
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const { questions } = req.body;
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    quiz.questions = questions;
    await quiz.save();
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating quiz');
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await QuizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    await quiz.remove();
    res.status(200).send('Quiz deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting quiz');
  }
};
