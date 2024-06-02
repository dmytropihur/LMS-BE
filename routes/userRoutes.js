const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/completed-lessons', userController.getUserCompletedLessons);
router.get('/:id/progress', userController.getUserProgress);
router.put('/:id/password', userController.updatePassword);
router.get('/:id/quiz-attempts', userController.getUserQuizAttempts);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
