const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
    },
  ],
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
