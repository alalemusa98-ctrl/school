const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 0. Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const [[studentsCount]] = await db.query('SELECT COUNT(*) AS total FROM students');
    const [[teachersCount]] = await db.query('SELECT COUNT(*) AS total FROM teachers');
    const [[sectionsCount]] = await db.query('SELECT COUNT(*) AS total FROM sections');
    const [[tasksCount]] = await db.query('SELECT COUNT(*) AS total FROM assessment_tasks');

    return res.json({
      success: true,
      stats: {
        totalStudents: studentsCount.total,
        totalTeachers: teachersCount.total,
        totalSections: sectionsCount.total,
        totalTasks: tasksCount.total
      }
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع الإحصائيات.' });
  }
};

// 1. Grades & Sections
const getGrades = async (req, res) => {
  try {
    const [grades] = await db.query('SELECT * FROM grades ORDER BY level ASC');
    const [sections] = await db.query('SELECT * FROM sections ORDER BY name ASC');
    const [subjects] = await db.query('SELECT * FROM subjects ORDER BY name ASC');

    const result = grades.map(g => ({
      ...g,
      sections: sections.filter(sec => sec.grade_id === g.id),
      subjects: subjects.filter(sub => sub.grade_id === g.id)
    }));

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Get Grades Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع الصفوف.' });
  }
};

const createSection = async (req, res) => {
  try {
    const { grade_id, name } = req.body;
    if (!grade_id || !name) {
      return res.status(400).json({ success: false, message: 'يرجى اختيار الصف وإدخال اسم الشعبة.' });
    }

    const [result] = await db.query('INSERT INTO sections (grade_id, name) VALUES (?, ?)', [grade_id, name]);
    return res.status(201).json({ success: true, message: 'تم إضافة الشعبة بنجاح.', sectionId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'هذه الشعبة موجودة بالفعل لهذا الصف.' });
    }
    console.error('Create Section Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء إضافة الشعبة.' });
  }
};

const deleteSection = async (req, res) => {
  try {
    const sectionId = req.params.id;
    await db.query('DELETE FROM sections WHERE id = ?', [sectionId]);
    return res.json({ success: true, message: 'تم حذف الشعبة بنجاح.' });
  } catch (error) {
    console.error('Delete Section Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الشعبة.' });
  }
};

// 2. Subjects
const getSubjects = async (req, res) => {
  try {
    const { grade_id } = req.query;
    let query = `
      SELECT sub.*, g.name AS grade_name, g.level
      FROM subjects sub
      JOIN grades g ON sub.grade_id = g.id
    `;
    const params = [];

    if (grade_id) {
      query += ` WHERE sub.grade_id = ?`;
      params.push(grade_id);
    }
    query += ` ORDER BY g.level ASC, sub.name ASC`;

    const [subjects] = await db.query(query, params);
    return res.json({ success: true, data: subjects });
  } catch (error) {
    console.error('Get Subjects Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع المواد.' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { grade_id, name } = req.body;
    if (!grade_id || !name) {
      return res.status(400).json({ success: false, message: 'يرجى اختيار الصف وإدخال اسم المادة.' });
    }

    const [result] = await db.query('INSERT INTO subjects (grade_id, name) VALUES (?, ?)', [grade_id, name]);
    return res.status(201).json({ success: true, message: 'تم إضافة المادة بنجاح.', subjectId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'هذه المادة موجودة بالفعل لهذا الصف.' });
    }
    console.error('Create Subject Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة المادة.' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    await db.query('DELETE FROM subjects WHERE id = ?', [subjectId]);
    return res.json({ success: true, message: 'تم حذف المادة بنجاح.' });
  } catch (error) {
    console.error('Delete Subject Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المادة.' });
  }
};

// 3. Students Management
const getStudents = async (req, res) => {
  try {
    const { grade_id, section_id } = req.query;
    let query = `
      SELECT s.*, g.name AS grade_name, sec.name AS section_name
      FROM students s
      JOIN grades g ON s.grade_id = g.id
      JOIN sections sec ON s.section_id = sec.id
    `;
    const params = [];
    const conditions = [];

    if (grade_id) {
      conditions.push(`s.grade_id = ?`);
      params.push(grade_id);
    }
    if (section_id) {
      conditions.push(`s.section_id = ?`);
      params.push(section_id);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }
    query += ` ORDER BY g.level ASC, sec.name ASC, s.full_name ASC`;

    const [students] = await db.query(query, params);
    return res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    console.error('Get Students Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع قائمة الطلاب.' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { roll_number, student_code, full_name, grade_id, section_id } = req.body;
    if (!roll_number || !student_code || !full_name || !grade_id || !section_id) {
      return res.status(400).json({ success: false, message: 'يرجى إكمال جميع حقول بيانات الطالب.' });
    }

    const [result] = await db.query(`
      INSERT INTO students (roll_number, student_code, full_name, grade_id, section_id)
      VALUES (?, ?, ?, ?, ?)
    `, [roll_number, student_code, full_name, grade_id, section_id]);

    return res.status(201).json({ success: true, message: 'تم تسجيل الطالب بنجاح.', studentId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'رقم الجلوس هذا مستخدم بالفعل لطالب آخر.' });
    }
    console.error('Create Student Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إدراج الطالب.' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { roll_number, student_code, full_name, grade_id, section_id } = req.body;

    await db.query(`
      UPDATE students 
      SET roll_number = ?, student_code = ?, full_name = ?, grade_id = ?, section_id = ?
      WHERE id = ?
    `, [roll_number, student_code, full_name, grade_id, section_id, studentId]);

    return res.json({ success: true, message: 'تم تحديث بيانات الطالب بنجاح.' });
  } catch (error) {
    console.error('Update Student Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث بيانات الطالب.' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    await db.query('DELETE FROM students WHERE id = ?', [studentId]);
    return res.json({ success: true, message: 'تم حذف الطالب بنجاح.' });
  } catch (error) {
    console.error('Delete Student Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الطالب.' });
  }
};

// 4. Teachers Management
const getTeachers = async (req, res) => {
  try {
    const [teachers] = await db.query('SELECT id, username, full_name, created_at FROM teachers ORDER BY full_name ASC');
    return res.json({ success: true, data: teachers });
  } catch (error) {
    console.error('Get Teachers Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع قائمة المعلمين.' });
  }
};

const createTeacher = async (req, res) => {
  try {
    const { username, password, full_name } = req.body;
    if (!username || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'يرجى تعبئة اسم المستخدم، كلمة المرور، والاسم الكامل.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(`
      INSERT INTO teachers (username, password_hash, full_name)
      VALUES (?, ?, ?)
    `, [username, passwordHash, full_name]);

    return res.status(201).json({ success: true, message: 'تم إضافة حساب المعلم بنجاح.', teacherId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'اسم المستخدم هذا مأخوذ بالفعل لمعلم آخر.' });
    }
    console.error('Create Teacher Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إنشاء حساب المعلم.' });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    await db.query('DELETE FROM teachers WHERE id = ?', [teacherId]);
    return res.json({ success: true, message: 'تم حذف حساب المعلم بنجاح.' });
  } catch (error) {
    console.error('Delete Teacher Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المعلم.' });
  }
};

// Teacher Assignments
const getTeacherAssignments = async (req, res) => {
  try {
    const [assignments] = await db.query(`
      SELECT ta.id, ta.teacher_id, t.full_name AS teacher_name,
             ta.subject_id, sub.name AS subject_name,
             ta.section_id, sec.name AS section_name, g.name AS grade_name
      FROM teacher_assignments ta
      JOIN teachers t ON ta.teacher_id = t.id
      JOIN subjects sub ON ta.subject_id = sub.id
      JOIN sections sec ON ta.section_id = sec.id
      JOIN grades g ON sec.grade_id = g.id
      ORDER BY t.full_name ASC
    `);

    return res.json({ success: true, data: assignments });
  } catch (error) {
    console.error('Get Teacher Assignments Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع تكليفات المعلمين.' });
  }
};

const createTeacherAssignment = async (req, res) => {
  try {
    const { teacher_id, subject_id, section_id } = req.body;
    if (!teacher_id || !subject_id || !section_id) {
      return res.status(400).json({ success: false, message: 'يرجى تحديد المعلم، المادة، والشعبة.' });
    }

    const [result] = await db.query(`
      INSERT INTO teacher_assignments (teacher_id, subject_id, section_id)
      VALUES (?, ?, ?)
    `, [teacher_id, subject_id, section_id]);

    return res.status(201).json({ success: true, message: 'تم تكليف المعلم بنجاح.', assignmentId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'هذا المعلم مكلف بالفعل بهذه المادة لهذه الشعبة.' });
    }
    console.error('Create Assignment Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء تكليف المعلم.' });
  }
};

const deleteTeacherAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    await db.query('DELETE FROM teacher_assignments WHERE id = ?', [assignmentId]);
    return res.json({ success: true, message: 'تم إزالة التكليف بنجاح.' });
  } catch (error) {
    console.error('Delete Assignment Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء إزالة التكليف.' });
  }
};

// 5. Weekly Schedule Management
const getScheduleSlots = async (req, res) => {
  try {
    const { section_id } = req.query;
    let query = `
      SELECT slot.*, sec.name AS section_name, sub.name AS subject_name, t.full_name AS teacher_name, g.name AS grade_name
      FROM schedule_slots slot
      JOIN sections sec ON slot.section_id = sec.id
      JOIN grades g ON sec.grade_id = g.id
      JOIN subjects sub ON slot.subject_id = sub.id
      JOIN teachers t ON slot.teacher_id = t.id
    `;
    const params = [];

    if (section_id) {
      query += ` WHERE slot.section_id = ?`;
      params.push(section_id);
    }
    query += ` ORDER BY slot.day_of_week ASC, slot.slot_number ASC`;

    const [slots] = await db.query(query, params);
    return res.json({ success: true, data: slots });
  } catch (error) {
    console.error('Get Schedule Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء استرجاع جدول الحصص.' });
  }
};

const upsertScheduleSlot = async (req, res) => {
  try {
    const { section_id, day_of_week, slot_number, subject_id, teacher_id } = req.body;
    if (!section_id || !day_of_week || !slot_number || !subject_id || !teacher_id) {
      return res.status(400).json({ success: false, message: 'يرجى إكمال تفاصيل الحصة (الشعبة، اليوم، رقم الحصة، المادة، المعلم).' });
    }

    await db.query(`
      INSERT INTO schedule_slots (section_id, day_of_week, slot_number, subject_id, teacher_id)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE subject_id = VALUES(subject_id), teacher_id = VALUES(teacher_id);
    `, [section_id, day_of_week, slot_number, subject_id, teacher_id]);

    return res.json({ success: true, message: 'تم تخصيص الحصة بالجدول بنجاح.' });
  } catch (error) {
    console.error('Upsert Schedule Slot Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء تخصيص الحصة.' });
  }
};

const deleteScheduleSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    await db.query('DELETE FROM schedule_slots WHERE id = ?', [slotId]);
    return res.json({ success: true, message: 'تم تفريغ الحصة من الجدول بنجاح.' });
  } catch (error) {
    console.error('Delete Schedule Slot Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء مسح الحصة.' });
  }
};

module.exports = {
  getDashboardStats,
  getGrades,
  createSection,
  deleteSection,
  getSubjects,
  createSubject,
  deleteSubject,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getTeachers,
  createTeacher,
  deleteTeacher,
  getTeacherAssignments,
  createTeacherAssignment,
  deleteTeacherAssignment,
  getScheduleSlots,
  upsertScheduleSlot,
  deleteScheduleSlot
};
