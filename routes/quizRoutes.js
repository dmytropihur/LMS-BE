const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.get('/', quizController.getAllQuizzes);
router.put('/:id', quizController.updateQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;
