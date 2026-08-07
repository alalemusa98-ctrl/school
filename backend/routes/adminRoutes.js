const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.use(authenticateToken, requireRole('ADMIN'));

// Stats
router.get('/stats', adminController.getDashboardStats);

// Grades & Sections
router.get('/grades', adminController.getGrades);
router.post('/sections', adminController.createSection);
router.delete('/sections/:id', adminController.deleteSection);

// Subjects
router.get('/subjects', adminController.getSubjects);
router.post('/subjects', adminController.createSubject);
router.delete('/subjects/:id', adminController.deleteSubject);

// Students
router.get('/students', adminController.getStudents);
router.post('/students', adminController.createStudent);
router.put('/students/:id', adminController.updateStudent);
router.delete('/students/:id', adminController.deleteStudent);

// Teachers
router.get('/teachers', adminController.getTeachers);
router.post('/teachers', adminController.createTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Assignments
router.get('/assignments', adminController.getTeacherAssignments);
router.post('/assignments', adminController.createTeacherAssignment);
router.delete('/assignments/:id', adminController.deleteTeacherAssignment);

// Schedule
router.get('/schedule', adminController.getScheduleSlots);
router.post('/schedule', adminController.upsertScheduleSlot);
router.delete('/schedule/:id', adminController.deleteScheduleSlot);

module.exports = router;
