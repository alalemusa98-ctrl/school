const db = require('../../config/db');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Seeding initial data into database...');

  const isSqlite = db.isSQLite();

  // 1. Seed Academic Year
  const [existingYears] = await db.query(`SELECT id FROM academic_years WHERE name = '2025/2026';`);
  if (existingYears.length === 0) {
    await db.query(`INSERT INTO academic_years (name, is_current) VALUES ('2025/2026', 1);`);
  }
  console.log('  ├─ Academic Year 2025/2026 seeded.');

  // 2. Seed Grades 1 to 9
  const gradeNames = [
    'الصف الأول',
    'الصف الثاني',
    'الصف الثالث',
    'الصف الرابع',
    'الصف الخامس',
    'الصف السادس',
    'الصف السابع',
    'الصف الثامن',
    'الصف التاسع'
  ];

  for (let level = 1; level <= 9; level++) {
    const [existingGrades] = await db.query(`SELECT id FROM grades WHERE level = ?;`, [level]);
    if (existingGrades.length === 0) {
      await db.query(`INSERT INTO grades (level, name) VALUES (?, ?);`, [level, gradeNames[level - 1]]);
    }
  }
  console.log('  ├─ Grades 1-9 seeded.');

  // 3. Seed Default Admin Account
  const [existingAdmins] = await db.query(`SELECT id FROM admins WHERE username = 'admin';`);
  if (existingAdmins.length === 0) {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    await db.query(`
      INSERT INTO admins (username, password_hash, full_name)
      VALUES ('admin', ?, 'مدير المدرسة');
    `, [adminPasswordHash]);
  }
  console.log('  ├─ Admin user (\'admin\' / \'admin123\') seeded.');

  // 4. Seed Default Sections & Subjects for Grade 5
  const [grade5Rows] = await db.query(`SELECT id FROM grades WHERE level = 5 LIMIT 1;`);
  if (grade5Rows.length > 0) {
    const grade5Id = grade5Rows[0].id;

    // Sections 5A, 5B
    const [secA] = await db.query(`SELECT id FROM sections WHERE grade_id = ? AND name = '5أ';`, [grade5Id]);
    if (secA.length === 0) {
      await db.query(`INSERT INTO sections (grade_id, name) VALUES (?, '5أ'), (?, '5ب');`, [grade5Id, grade5Id]);
    }

    // Subjects
    const subjectsList = ['التربية الإسلامية', 'اللغة العربية', 'الرياضيات', 'العلوم', 'اللغة الإنجليزية'];
    for (const subName of subjectsList) {
      const [subCheck] = await db.query(`SELECT id FROM subjects WHERE grade_id = ? AND name = ?;`, [grade5Id, subName]);
      if (subCheck.length === 0) {
        await db.query(`INSERT INTO subjects (grade_id, name) VALUES (?, ?);`, [grade5Id, subName]);
      }
    }
    console.log('  ├─ Sample sections and subjects for Grade 5 seeded.');

    // 5. Seed Sample Teacher
    const [existingTeachers] = await db.query(`SELECT id FROM teachers WHERE username = 'teacher1';`);
    let teacherId;
    if (existingTeachers.length === 0) {
      const teacherPasswordHash = await bcrypt.hash('teacher123', 10);
      const [tRes] = await db.query(`
        INSERT INTO teachers (username, password_hash, full_name)
        VALUES ('teacher1', ?, 'أ. أسامة علي');
      `, [teacherPasswordHash]);
      teacherId = tRes.insertId;
    } else {
      teacherId = existingTeachers[0].id;
    }
    console.log('  ├─ Sample teacher (\'teacher1\' / \'teacher123\') seeded.');

    // Get IDs
    const [secRows] = await db.query(`SELECT id FROM sections WHERE grade_id = ? AND name = '5أ' LIMIT 1;`, [grade5Id]);
    const [subRows] = await db.query(`SELECT id FROM subjects WHERE grade_id = ? AND name = 'الرياضيات' LIMIT 1;`, [grade5Id]);

    if (secRows.length > 0 && subRows.length > 0 && teacherId) {
      const sectionId = secRows[0].id;
      const subjectId = subRows[0].id;

      const [assignCheck] = await db.query(`
        SELECT id FROM teacher_assignments 
        WHERE teacher_id = ? AND subject_id = ? AND section_id = ?;
      `, [teacherId, subjectId, sectionId]);

      if (assignCheck.length === 0) {
        await db.query(`
          INSERT INTO teacher_assignments (teacher_id, subject_id, section_id)
          VALUES (?, ?, ?);
        `, [teacherId, subjectId, sectionId]);
      }
      console.log('  ├─ Assigned \'teacher1\' to Math for Section 5A.');

      // 6. Seed Sample Student
      const [studentCheck] = await db.query(`SELECT id FROM students WHERE roll_number = '1001';`);
      if (studentCheck.length === 0) {
        await db.query(`
          INSERT INTO students (roll_number, student_code, full_name, grade_id, section_id)
          VALUES ('1001', 'ST1001', 'أحمد خالد', ?, ?);
        `, [grade5Id, sectionId]);
      }
      console.log('  ├─ Sample Student (Roll: \'1001\', Code: \'ST1001\') seeded.');

      // 7. Seed Sample Homework Task
      const [taskCheck] = await db.query(`SELECT id FROM assessment_tasks WHERE section_id = ? AND subject_id = ?;`, [sectionId, subjectId]);
      if (taskCheck.length === 0) {
        await db.query(`
          INSERT INTO assessment_tasks (title, description, task_type, subject_id, section_id, teacher_id, due_date, has_solution, solution_text)
          VALUES (
            'تمارين الفصل الأول: ضرب الأعداد الكبيرة',
            'الرجاء حل جميع التمارين في كراسة الواجب صفحة 24 إلى 26.',
            'HOMEWORK',
            ?,
            ?,
            ?,
            '2026-08-15',
            1,
            'الحل النموذجي: التمرين 1: 150، التمرين 2: 420.'
          );
        `, [subjectId, sectionId, teacherId]);
      }
      console.log('  ├─ Sample Homework Task created.');
    }
  }

  console.log('✨ Database seeding completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
