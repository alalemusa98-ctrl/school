const db = require('../config/db');

// 1. Get Assigned Sections & Subjects for Teacher
const getTeacherAssignments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const [rows] = await db.query(`
      SELECT ta.id AS assignment_id,
             sub.id AS subject_id, sub.name AS subject_name,
             sec.id AS section_id, sec.name AS section_name,
             g.id AS grade_id, g.name AS grade_name
      FROM teacher_assignments ta
      JOIN subjects sub ON ta.subject_id = sub.id
      JOIN sections sec ON ta.section_id = sec.id
      JOIN grades g ON sec.grade_id = g.id
      WHERE ta.teacher_id = ?
      ORDER BY g.level ASC, sec.name ASC, sub.name ASC
    `, [teacherId]);

    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get Teacher Assignments Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع التكليفات.' });
  }
};

// 2. Get Tasks Created by Teacher
const getTeacherTasks = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { section_id, subject_id } = req.query;

    let query = `
      SELECT t.id, t.title, t.description, t.task_type, t.attachment_path, t.due_date, t.created_at,
             t.has_solution, t.solution_text, t.solution_attachment_path,
             sub.id AS subject_id, sub.name AS subject_name,
             sec.id AS section_id, sec.name AS section_name, g.name AS grade_name
      FROM assessment_tasks t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN sections sec ON t.section_id = sec.id
      JOIN grades g ON sec.grade_id = g.id
      WHERE t.teacher_id = ?
    `;

    const params = [teacherId];

    if (section_id) {
      query += ` AND t.section_id = ?`;
      params.push(section_id);
    }
    if (subject_id) {
      query += ` AND t.subject_id = ?`;
      params.push(subject_id);
    }

    query += ` ORDER BY t.created_at DESC`;

    const [tasks] = await db.query(query, params);

    return res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('Get Teacher Tasks Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع واجبات المعلم.' });
  }
};

// 3. Create Task (Homework or Exam) with Solution Option
const createTask = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, task_type, subject_id, section_id, due_date, has_solution, solution_text } = req.body;

    if (!title || !task_type || !subject_id || !section_id) {
      return res.status(400).json({ success: false, message: 'يرجى ملء جميع الحقول الإلزامية (العنوان، النوع، المادة، الشعبة).' });
    }

    // Verify teacher is assigned to this section & subject
    const [assignmentCheck] = await db.query(`
      SELECT id FROM teacher_assignments 
      WHERE teacher_id = ? AND subject_id = ? AND section_id = ?
    `, [teacherId, subject_id, section_id]);

    if (assignmentCheck.length === 0) {
      return res.status(403).json({ success: false, message: 'عذراً، أنت غير مكلف بتدريس هذه المادة لهذه الشعبة.' });
    }

    let attachmentPath = null;
    let solutionAttachmentPath = null;

    if (req.files) {
      if (req.files['attachment'] && req.files['attachment'][0]) {
        attachmentPath = '/uploads/' + req.files['attachment'][0].filename;
      }
      if (req.files['solution_attachment'] && req.files['solution_attachment'][0]) {
        solutionAttachmentPath = '/uploads/' + req.files['solution_attachment'][0].filename;
      }
    }

    const hasSolBool = (has_solution === 'true' || has_solution === true || has_solution === '1' || has_solution === 1) ? 1 : 0;

    const [result] = await db.query(`
      INSERT INTO assessment_tasks 
      (title, description, task_type, subject_id, section_id, teacher_id, attachment_path, due_date, has_solution, solution_text, solution_attachment_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      description || null,
      task_type,
      subject_id,
      section_id,
      teacherId,
      attachmentPath,
      due_date || null,
      hasSolBool,
      hasSolBool ? (solution_text || null) : null,
      hasSolBool ? solutionAttachmentPath : null
    ]);

    return res.status(201).json({
      success: true,
      message: 'تم إنشاء المهمة بنجاح.',
      taskId: result.insertId
    });
  } catch (error) {
    console.error('Create Task Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء إضافة المهمة.' });
  }
};

// 4. Update Task
const updateTask = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const taskId = req.params.id;
    const { title, description, due_date, has_solution, solution_text } = req.body;

    const [existing] = await db.query('SELECT * FROM assessment_tasks WHERE id = ? AND teacher_id = ?', [taskId, teacherId]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'المهمة غير موجودة أو ليس لديك صلاحية تعديلها.' });
    }

    const task = existing[0];
    let attachmentPath = task.attachment_path;
    let solutionAttachmentPath = task.solution_attachment_path;

    if (req.files) {
      if (req.files['attachment'] && req.files['attachment'][0]) {
        attachmentPath = '/uploads/' + req.files['attachment'][0].filename;
      }
      if (req.files['solution_attachment'] && req.files['solution_attachment'][0]) {
        solutionAttachmentPath = '/uploads/' + req.files['solution_attachment'][0].filename;
      }
    }

    const hasSolBool = (has_solution === 'true' || has_solution === true || has_solution === '1' || has_solution === 1) ? 1 : 0;

    await db.query(`
      UPDATE assessment_tasks 
      SET title = ?, description = ?, due_date = ?, attachment_path = ?,
          has_solution = ?, solution_text = ?, solution_attachment_path = ?
      WHERE id = ? AND teacher_id = ?
    `, [
      title || task.title,
      description !== undefined ? description : task.description,
      due_date !== undefined ? due_date : task.due_date,
      attachmentPath,
      hasSolBool,
      hasSolBool ? (solution_text !== undefined ? solution_text : task.solution_text) : null,
      hasSolBool ? solutionAttachmentPath : null,
      taskId,
      teacherId
    ]);

    return res.json({ success: true, message: 'تم تعديل المهمة بنجاح.' });
  } catch (error) {
    console.error('Update Task Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تعديل المهمة.' });
  }
};

// 5. Delete Task
const deleteTask = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const taskId = req.params.id;

    const [result] = await db.query('DELETE FROM assessment_tasks WHERE id = ? AND teacher_id = ?', [taskId, teacherId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'المهمة غير موجودة أو ليس لديك صلاحية حذفها.' });
    }

    return res.json({ success: true, message: 'تم حذف المهمة بنجاح.' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المهمة.' });
  }
};

module.exports = {
  getTeacherAssignments,
  getTeacherTasks,
  createTask,
  updateTask,
  deleteTask
};
