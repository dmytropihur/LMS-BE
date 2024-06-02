const express = require('express');
const progressController = require('../controllers/progressController');

const router = express.Router();

router.get('/user/:id', progressController.getProgressForUser);
router.get('/lesson/:id', progressController.getProgressForLesson);
router.post('/lesson/:id', progressController.updateProgressForLesson);

module.exports = router;
