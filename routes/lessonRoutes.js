const express = require('express');
const lessonController = require('../controllers/lessonController');

const router = express.Router();

router.get('/', lessonController.getAllLessons);
router.post('/', lessonController.createLesson);
router.get('/:id', lessonController.getLessonById);
router.put('/:id', lessonController.updateLesson);
router.delete('/:id', lessonController.deleteLesson);
router.post('/:id/complete', lessonController.completeLesson);
router.get('/:id/quiz', lessonController.getQuiz);
router.post('/:id/quiz', lessonController.createQuiz);
router.get('/:id/quiz-attempts', lessonController.getQuizAttempts);
router.post('/:id/quiz-attempts', lessonController.submitQuiz);
module.exports = router;
