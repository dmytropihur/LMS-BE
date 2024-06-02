const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, config.jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.userId = user.id;
    next();
  });
};

module.exports = authenticateToken;
