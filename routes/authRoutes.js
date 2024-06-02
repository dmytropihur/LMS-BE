const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

router.post('/register', authController.register);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;
