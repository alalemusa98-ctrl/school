const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken, requireRole('STUDENT'));

router.get('/profile', studentController.getStudentProfile);
router.get('/tasks', studentController.getStudentTasks);
router.get('/schedule', studentController.getStudentSchedule);
router.get('/subjects', studentController.getStudentSubjects);

module.exports = router;
