const db = require('../config/db');

// 1. Get Student Profile & Overview
const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const [rows] = await db.query(`
      SELECT s.id, s.roll_number, s.student_code, s.full_name, 
             g.id AS grade_id, g.name AS grade_name, g.level,
             sec.id AS section_id, sec.name AS section_name
      FROM students s
      JOIN grades g ON s.grade_id = g.id
      JOIN sections sec ON s.section_id = sec.id
      WHERE s.id = ?
    `, [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'لم يتم العثور على بيانات الطالب.' });
    }

    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء استرجاع بيانات الطالب.' });
  }
};

// 2. Get Tasks (Homeworks & Exams) for Student's Section
const getStudentTasks = async (req, res) => {
  try {
    const sectionId = req.user.sectionId;
    const { subject_id, task_type } = req.query;

    let query = `
      SELECT t.id, t.title, t.description, t.task_type, t.attachment_path, t.due_date, t.created_at,
             t.has_solution, t.solution_text, t.solution_attachment_path,
             sub.id AS subject_id, sub.name AS subject_name,
             teacher.full_name AS teacher_name
      FROM assessment_tasks t
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers teacher ON t.teacher_id = teacher.id
      WHERE t.section_id = ?
    `;

    const params = [sectionId];

    if (subject_id) {
      query += ` AND t.subject_id = ?`;
      params.push(subject_id);
    }

    if (task_type) {
      query += ` AND t.task_type = ?`;
      params.push(task_type);
    }

    query += ` ORDER BY t.created_at DESC`;

    const [tasks] = await db.query(query, params);

    return res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get Student Tasks Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع قائمة الواجبات والامتحانات.' });
  }
};

// 3. Get Student Weekly Schedule
const getStudentSchedule = async (req, res) => {
  try {
    const sectionId = req.user.sectionId;

    const [slots] = await db.query(`
      SELECT slot.id, slot.day_of_week, slot.slot_number,
             sub.name AS subject_name, teacher.full_name AS teacher_name
      FROM schedule_slots slot
      JOIN subjects sub ON slot.subject_id = sub.id
      JOIN teachers teacher ON slot.teacher_id = teacher.id
      WHERE slot.section_id = ?
      ORDER BY slot.day_of_week ASC, slot.slot_number ASC
    `, [sectionId]);

    return res.json({
      success: true,
      data: slots
    });
  } catch (error) {
    console.error('Get Student Schedule Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع الجدول الدراسي.' });
  }
};

// 4. Get Student Subjects
const getStudentSubjects = async (req, res) => {
  try {
    const gradeId = req.user.gradeId;

    const [subjects] = await db.query(`
      SELECT id, name FROM subjects WHERE grade_id = ? ORDER BY name ASC
    `, [gradeId]);

    return res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Get Student Subjects Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع المواد الدراسية.' });
  }
};

module.exports = {
  getStudentProfile,
  getStudentTasks,
  getStudentSchedule,
  getStudentSubjects
};
