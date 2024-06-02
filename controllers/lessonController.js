const LessonModel = require('../models/Lesson');

exports.getAllLessons = async (req, res) => {
  try {
    // Implementation to fetch all lessons
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lessons');
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { title, content, courseId } = req.body;
    const lesson = new LessonModel({
      title,
      content,
      course: courseId,
    });
    await lesson.save();
    // Update lessons array in the corresponding course
    await CourseModel.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id },
    });
    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating lesson');
  }
};

exports.getLessonById = async (req, res) => {
  try {
    // Implementation to fetch a lesson by ID
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching lesson');
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, content } = req.body;
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      return res.status(404).send('Lesson not found');
    }
    // Check if the user is the instructor of the course the lesson belongs to
    const course = await CourseModel.findOne({ lessons: lessonId });
    if (!course || course.instructor.toString() !== req.userId) {
      return res
        .status(403)
        .send('You do not have permission to update this lesson');
    }
    lesson.title = title;
    lesson.content = content;
    await lesson.save();
    res.status(200).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating lesson');
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) {
      return res.status(404).send('Lesson not found');
    }
    // Check if the user is the instructor of the course the lesson belongs to
    const course = await CourseModel.findOne({ lessons: lessonId });
    if (!course || course.instructor.toString() !== req.userId) {
      return res
        .status(403)
        .send('You do not have permission to delete this lesson');
    }
    await lesson.remove();
    res.status(200).send('Lesson deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting lesson');
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const progress = await ProgressModel.findOne({
      user: req.userId,
      lesson: lessonId,
    });
    if (!progress) {
      return res.status(404).send('Progress record not found');
    }
    progress.completed = true;
    await progress.save();
    res.status(200).send('Lesson marked as completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error marking lesson as completed');
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { questions } = req.body;
    const quiz = new QuizModel({
      lesson: lessonId,
      questions,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating quiz');
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const quiz = await QuizModel.findOne({ lesson: lessonId });
    if (!quiz) {
      return res.status(404).send('Quiz not found for this lesson');
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching quiz');
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { answers } = req.body;
    const quiz = await QuizModel.findOne({ lesson: lessonId });
    if (!quiz) {
      return res.status(404).send('Quiz not found for this lesson');
    }
    // Calculate score
    let score = 0;
    for (const answer of answers) {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++;
      }
    }
    const percentageScore = (score / quiz.questions.length) * 100;
    const quizAttempt = new QuizAttemptModel({
      user: req.userId,
      lesson: lessonId,
      score: percentageScore,
      answers,
    });
    await quizAttempt.save();
    res.status(201).json({ score: percentageScore });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error submitting quiz attempt');
  }
};

exports.getQuizAttempts = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const quizAttempts = await QuizAttemptModel.find({
      lesson: lessonId,
    }).populate('user', 'username');
    res.status(200).json(quizAttempts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching quiz attempts for lesson');
  }
};
