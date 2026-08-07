const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// 1. Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المستخدم وكلمة المرور.' });
    }

    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const token = generateToken({
      id: admin.id,
      role: 'ADMIN',
      username: admin.username,
      fullName: admin.full_name
    });

    return res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: admin.id,
        role: 'ADMIN',
        username: admin.username,
        fullName: admin.full_name
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء تسجيل الدخول.' });
  }
};

// 2. Teacher Login
const loginTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المستخدم وكلمة المرور.' });
    }

    const [rows] = await db.query('SELECT * FROM teachers WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const teacher = rows[0];
    const isMatch = await bcrypt.compare(password, teacher.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }

    const token = generateToken({
      id: teacher.id,
      role: 'TEACHER',
      username: teacher.username,
      fullName: teacher.full_name
    });

    return res.json({
      success: true,
      message: 'تم تسجيل دخول المعلم بنجاح',
      token,
      user: {
        id: teacher.id,
        role: 'TEACHER',
        username: teacher.username,
        fullName: teacher.full_name
      }
    });
  } catch (error) {
    console.error('Teacher Login Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء تسجيل الدخول.' });
  }
};

// 3. Student Login (roll_number + student_code)
const loginStudent = async (req, res) => {
  try {
    const { roll_number, student_code } = req.body;
    if (!roll_number || !student_code) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رقم الجلوس وكود الطالب.' });
    }

    const [rows] = await db.query(`
      SELECT s.*, g.name AS grade_name, sec.name AS section_name
      FROM students s
      JOIN grades g ON s.grade_id = g.id
      JOIN sections sec ON s.section_id = sec.id
      WHERE s.roll_number = ? AND s.student_code = ?
    `, [roll_number, student_code]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'رقم الجلوس أو كود الطالب غير صحيح.' });
    }

    const student = rows[0];

    const token = generateToken({
      id: student.id,
      role: 'STUDENT',
      rollNumber: student.roll_number,
      fullName: student.full_name,
      gradeId: student.grade_id,
      sectionId: student.section_id
    });

    return res.json({
      success: true,
      message: 'تم تسجيل دخول الطالب بنجاح',
      token,
      user: {
        id: student.id,
        role: 'STUDENT',
        rollNumber: student.roll_number,
        fullName: student.full_name,
        gradeId: student.grade_id,
        sectionId: student.section_id,
        gradeName: student.grade_name,
        sectionName: student.section_name
      }
    });
  } catch (error) {
    console.error('Student Login Error:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء تسجيل الدخول.' });
  }
};

// 4. Get Current Auth Status
const getCurrentUser = async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};

module.exports = {
  loginAdmin,
  loginTeacher,
  loginStudent,
  getCurrentUser
};
