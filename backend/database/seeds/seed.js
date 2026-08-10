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

  // 4. Seed Teachers
  const teachersData = [
    { username: 'teacher1', name: 'أ. أسامة علي' },
    { username: 'teacher2', name: 'أ. أحمد سالم' },
    { username: 'teacher3', name: 'أ. فاطمة العبيدي' },
    { username: 'teacher4', name: 'أ. عمر الشريف' },
    { username: 'teacher5', name: 'أ. مريم الفيتوري' }
  ];

  const teacherIdsMap = {};
  for (const t of teachersData) {
    const [existing] = await db.query(`SELECT id FROM teachers WHERE username = ?;`, [t.username]);
    if (existing.length === 0) {
      const hash = await bcrypt.hash('teacher123', 10);
      const [res] = await db.query(`INSERT INTO teachers (username, password_hash, full_name) VALUES (?, ?, ?);`, [t.username, hash, t.name]);
      teacherIdsMap[t.name] = res.insertId;
    } else {
      teacherIdsMap[t.name] = existing[0].id;
    }
  }

  // 5. Seed Default Sections & Subjects for Grades 5 and 8
  const targetLevels = [5, 8];

  for (const level of targetLevels) {
    const [gradeRows] = await db.query(`SELECT id FROM grades WHERE level = ? LIMIT 1;`, [level]);
    if (gradeRows.length === 0) continue;
    const gradeId = gradeRows[0].id;

    // Sections
    const sectionName = `${level}أ`;
    let sectionId;
    const [secRows] = await db.query(`SELECT id FROM sections WHERE grade_id = ? AND name = ?;`, [gradeId, sectionName]);
    if (secRows.length === 0) {
      const [sRes] = await db.query(`INSERT INTO sections (grade_id, name) VALUES (?, ?);`, [gradeId, sectionName]);
      sectionId = sRes.insertId;
    } else {
      sectionId = secRows[0].id;
    }

    // Subjects with Teachers
    const subjectsMap = [
      { name: 'الرياضيات', teacher: 'أ. أحمد سالم' },
      { name: 'العلوم العامة', teacher: 'أ. فاطمة العبيدي' },
      { name: 'اللغة العربية', teacher: 'أ. عمر الشريف' },
      { name: 'اللغة الإنجليزية', teacher: 'أ. مريم الفيتوري' },
      { name: 'التربية الإسلامية', teacher: 'أ. أسامة علي' }
    ];

    for (const subItem of subjectsMap) {
      let subjectId;
      const [subRows] = await db.query(`SELECT id FROM subjects WHERE grade_id = ? AND name = ?;`, [gradeId, subItem.name]);
      if (subRows.length === 0) {
        const [subRes] = await db.query(`INSERT INTO subjects (grade_id, name) VALUES (?, ?);`, [gradeId, subItem.name]);
        subjectId = subRes.insertId;
      } else {
        subjectId = subRows[0].id;
      }

      const teacherId = teacherIdsMap[subItem.teacher] || teacherIdsMap['أ. أسامة علي'];

      // Assign teacher to subject and section
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

      // Seed Homework Task
      const [hwCheck] = await db.query(`
        SELECT id FROM assessment_tasks WHERE section_id = ? AND subject_id = ? AND task_type = 'HOMEWORK';
      `, [sectionId, subjectId]);
      if (hwCheck.length === 0) {
        await db.query(`
          INSERT INTO assessment_tasks (title, description, task_type, subject_id, section_id, teacher_id, due_date, has_solution, solution_text)
          VALUES (
            ?,
            ?,
            'HOMEWORK',
            ?, ?, ?,
            '2026-08-15',
            1,
            ?
          );
        `, [
          `واجب مادة ${subItem.name} - الفصل الأول`,
          `الرجاء حل تمارين كراسة الواجب الخاصة بمادة ${subItem.name} وتأكيد إرسال النواتج.`,
          subjectId,
          sectionId,
          teacherId,
          `الحل النموذجي المعتمد لمادة ${subItem.name}:\n1) الإجابة الأولى: الصحيحة والكاملة.\n2) الإجابة الثانية: مراجعة الخطوات الحسابية.`
        ]);
      }

    }

    // Seed Non-Consecutive Exams (أيـام غير متتالية: يومين بهما امتحانيين ويومين بهما امتحان واحد)
    const examSeeds = [
      // Day 1: الأحد 16 أغسطس 2026 (امتحانيين)
      { subName: 'العلوم العامة', date: '2026-08-16', title: 'امتحان العلوم الشهري', desc: 'اختبار تحصيلي في مفاهيم المادة والحرارة والكيمياء.' },
      { subName: 'التربية الإسلامية', date: '2026-08-16', title: 'اختبار القرآن والتفسير', desc: 'اختبار في حفظ وتفسير السور المقررة للفصل الأول.' },

      // Day 2: الأربعاء 19 أغسطس 2026 (امتحان واحد - بعد 3 أيام)
      { subName: 'الرياضيات', date: '2026-08-19', title: 'امتحان الرياضيات النصف سنوي', desc: 'اختبار الجبر والهندسة التحليلية ومعادلات الدرجة الأولى.' },

      // Day 3: الأحد 23 أغسطس 2026 (امتحانيين - بعد 4 أيام)
      { subName: 'اللغة العربية', date: '2026-08-23', title: 'اختبار النحو والقراءة', desc: 'اختبار قواعد الإعراب والأسماء الخمسة والنصوص.' },
      { subName: 'العلوم العامة', date: '2026-08-23', title: 'امتحان المعمل والفيزياء', desc: 'تجارب المعمل والدائرة الكهربائية والقياس الفيزيائي.' },

      // Day 4: الخميس 27 أغسطس 2026 (امتحان واحد - بعد 4 أيام)
      { subName: 'اللغة الإنجليزية', date: '2026-08-27', title: 'Unit 3 Comprehensive Exam', desc: 'Grammar, Reading Comprehension and Vocabulary Exam.' }
    ];

    for (const ex of examSeeds) {
      const [subRows] = await db.query(`SELECT id FROM subjects WHERE grade_id = ? AND name = ?;`, [gradeId, ex.subName]);
      if (subRows.length === 0) continue;
      const subjectId = subRows[0].id;
      const [tAssign] = await db.query(`SELECT teacher_id FROM teacher_assignments WHERE subject_id = ? AND section_id = ? LIMIT 1;`, [subjectId, sectionId]);
      const teacherId = tAssign.length > 0 ? tAssign[0].teacher_id : (teacherIdsMap['أ. أسامة علي'] || 1);

      const [existCheck] = await db.query(`
        SELECT id FROM assessment_tasks WHERE section_id = ? AND subject_id = ? AND title = ? AND task_type = 'EXAM';
      `, [sectionId, subjectId, ex.title]);

      if (existCheck.length === 0) {
        await db.query(`
          INSERT INTO assessment_tasks (title, description, task_type, subject_id, section_id, teacher_id, due_date, has_solution, solution_text)
          VALUES (?, ?, 'EXAM', ?, ?, ?, ?, 1, ?);
        `, [
          ex.title,
          ex.desc,
          subjectId,
          sectionId,
          teacherId,
          ex.date,
          `النموذج الاسترشادي والحل المعتمد لاختبار ${ex.title}:\n1) الإجابات النموذجية كاملة وفقاً لمعايير التصحيح الوزارية.`
        ]);
      }
    }
  }

  // Seed Schedule Slots for Days 1 to 5
  for (const level of targetLevels) {
    const [gradeRows] = await db.query(`SELECT id FROM grades WHERE level = ? LIMIT 1;`, [level]);
    if (gradeRows.length === 0) continue;
    const gradeId = gradeRows[0].id;
    const [secRows] = await db.query(`SELECT id FROM sections WHERE grade_id = ? LIMIT 1;`, [gradeId]);
    if (secRows.length === 0) continue;
    const sectionId = secRows[0].id;

    const [subList] = await db.query(`SELECT id, name FROM subjects WHERE grade_id = ?;`, [gradeId]);
    const [tList] = await db.query(`SELECT id FROM teachers;`);

    if (subList.length > 0 && tList.length > 0) {
      for (let day = 1; day <= 5; day++) {
        for (let slotNum = 1; slotNum <= 6; slotNum++) {
          const subObj = subList[(day + slotNum) % subList.length];
          const teacherId = tList[slotNum % tList.length].id;

          const [slotCheck] = await db.query(`
            SELECT id FROM schedule_slots 
            WHERE section_id = ? AND day_of_week = ? AND slot_number = ?;
          `, [sectionId, day, slotNum]);

          if (slotCheck.length === 0) {
            await db.query(`
              INSERT INTO schedule_slots (section_id, day_of_week, slot_number, subject_id, teacher_id)
              VALUES (?, ?, ?, ?, ?);
            `, [sectionId, day, slotNum, subObj.id, teacherId]);
          }
        }
      }
    }
  }

  // Seed sample student for Roll 1001
  const [sec5ARows] = await db.query(`SELECT id, grade_id FROM sections WHERE name = '5أ' LIMIT 1;`);
  if (sec5ARows.length > 0) {
    const [studentCheck] = await db.query(`SELECT id FROM students WHERE roll_number = '1001';`);
    if (studentCheck.length === 0) {
      await db.query(`
        INSERT INTO students (roll_number, student_code, full_name, grade_id, section_id)
        VALUES ('1001', 'ST1001', 'أحمد خالد', ?, ?);
      `, [sec5ARows[0].grade_id, sec5ARows[0].id]);
    }
  }

  console.log('✨ Database seeding completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
