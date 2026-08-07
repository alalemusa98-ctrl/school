const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

router.post('/login/admin', authController.loginAdmin);
router.post('/login/teacher', authController.loginTeacher);
router.post('/login/student', authController.loginStudent);
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
