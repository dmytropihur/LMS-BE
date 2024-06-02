const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('PASSWORD', req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, 'secret');
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in user');
  }
};

exports.logout = async (req, res) => {
  try {
    // Implementation for user logout
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging out user');
  }
};
