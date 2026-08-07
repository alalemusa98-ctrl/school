const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');
const upload = require('../utils/upload');

router.use(authenticateToken, requireRole('TEACHER'));

router.get('/assignments', teacherController.getTeacherAssignments);
router.get('/tasks', teacherController.getTeacherTasks);

const cpUpload = upload.fields([
  { name: 'attachment', maxCount: 1 },
  { name: 'solution_attachment', maxCount: 1 }
]);

router.post('/tasks', cpUpload, teacherController.createTask);
router.put('/tasks/:id', cpUpload, teacherController.updateTask);
router.delete('/tasks/:id', teacherController.deleteTask);

module.exports = router;
