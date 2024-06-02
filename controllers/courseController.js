const CourseModel = require('../models/Course');
const LessonModel = require('../models/Lesson');
const ProgressModel = require('../models/Progress');

exports.getAllCourses = async (req, res) => {
  try {
    try {
      const courses = await CourseModel.find();
      res.status(200).json(courses);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching courses');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching courses');
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new CourseModel({
      title,
      description,
      owner: req.userId,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating course');
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    course.title = title;
    course.description = description;
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating course');
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching course');
  }
};

exports.searchByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const courses = await CourseModel.find({
      title: { $regex: new RegExp(title, 'i') },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error searching for courses');
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // Check if the user is the instructor of the course
    if (course.instructor.toString() !== req.userId) {
      return res
        .status(403)
        .send('You do not have permission to delete this course');
    }
    await course.remove();
    res.status(200).send('Course deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting course');
  }
};

exports.getLessonsForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    const lessons = await LessonModel.find({ course: courseId });
    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lessons');
  }
};

exports.getEnrolledUsersForCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const progress = await ProgressModel.find({
      lesson: {
        $in: (
          await LessonModel.find({ course: courseId })
        ).map((lesson) => lesson._id),
      },
    }).populate('user');
    const enrolledUsers = progress.map((progress) => progress.user);
    res.status(200).json(enrolledUsers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching enrolled users for course');
  }
};

exports.enrollUser = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // Check if user is already enrolled in the course
    const isEnrolled = await ProgressModel.findOne({
      user: req.userId,
      lesson: { $in: course.lessons },
    });
    if (isEnrolled) {
      return res.status(400).send('User is already enrolled in this course');
    }
    // Enroll user in each lesson of the course
    for (const lessonId of course.lessons) {
      const progress = new ProgressModel({
        user: req.userId,
        lesson: lessonId,
        completed: false,
      });
      await progress.save();
    }
    res.status(201).send('User enrolled in the course');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error enrolling user in course');
  }
};

exports.deleteUserFromCourse = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const progress = await ProgressModel.findOneAndDelete({
      user: userId,
      lesson: {
        $in: (
          await LessonModel.find({ course: id })
        ).map((lesson) => lesson._id),
      },
    });
    if (!progress) {
      return res.status(404).send('User not enrolled in the course');
    }
    res.status(200).send('User removed from course successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error removing user from course');
  }
};

exports.enrollMultipleUsers = async (req, res) => {
  try {
    const { courseId, userIds } = req.body;
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    // Enroll each user in the course
    for (const userId of userIds) {
      const existingProgress = await ProgressModel.findOne({
        user: userId,
        lesson: { $in: course.lessons },
      });
      if (!existingProgress) {
        for (const lessonId of course.lessons) {
          const progress = new ProgressModel({
            user: userId,
            lesson: lessonId,
            completed: false,
          });
          await progress.save();
        }
      }
    }
    res.status(201).send('Users enrolled in the course');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error enrolling users in course');
  }
};
