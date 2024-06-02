const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);
router.get('/:id/lessons', courseController.getLessonsForCourse);
router.get('/:id/enrolled-users', courseController.getEnrolledUsersForCourse);
router.delete(
  '/:id/enrolled-users/:userId',
  courseController.deleteUserFromCourse
);
router.post('/enroll', courseController.enrollUser);
router.post('/enroll-users', courseController.enrollMultipleUsers);
router.get('/search', courseController.searchByTitle);

module.exports = router;
