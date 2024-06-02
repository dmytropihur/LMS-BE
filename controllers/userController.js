const UserModel = require('../models/User');
const ProgressModel = require('../models/Progress');
const QuizAttemptModel = require('../models/QuizAttempt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Implementation to update user details
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating user');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    await user.remove();
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting user');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send('Password reset successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error resetting password');
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).send('Current password is incorrect');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send('Password updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating password');
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.params.id;
    const progress = await ProgressModel.find({ user: userId }).populate(
      'lesson'
    );
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user progress');
  }
};

exports.getUserCompletedLessons = async (req, res) => {
  try {
    const userId = req.params.id;
    const progress = await ProgressModel.find({
      user: userId,
      completed: true,
    }).populate('lesson');
    res.status(200).json(progress.map((progress) => progress.lesson));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching completed lessons for user');
  }
};

exports.getUserQuizAttempts = async (req, res) => {
  try {
    const userId = req.params.id;
    const quizAttempts = await QuizAttemptModel.find({ user: userId }).populate(
      'lesson',
      'title'
    );
    res.status(200).json(quizAttempts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching quiz attempts for user');
  }
};
