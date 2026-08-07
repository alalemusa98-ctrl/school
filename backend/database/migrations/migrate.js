const db = require('../../config/db');

async function migrate() {
  console.log('🚀 Running database migrations...');

  const isSqlite = db.isSQLite();

  const autoInc = isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
  const engineStr = isSqlite ? '' : 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';

  const queries = [
    `CREATE TABLE IF NOT EXISTS admins (
      id ${autoInc},
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS academic_years (
      id ${autoInc},
      name VARCHAR(50) NOT NULL UNIQUE,
      is_current TINYINT(1) DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS grades (
      id ${autoInc},
      level INT NOT NULL UNIQUE,
      name VARCHAR(50) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS sections (
      id ${autoInc},
      grade_id INT NOT NULL,
      name VARCHAR(50) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
      UNIQUE (grade_id, name)
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS subjects (
      id ${autoInc},
      grade_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grade_id) REFERENCES grades(id) ON DELETE CASCADE,
      UNIQUE (grade_id, name)
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS students (
      id ${autoInc},
      roll_number VARCHAR(50) NOT NULL UNIQUE,
      student_code VARCHAR(50) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      grade_id INT NOT NULL,
      section_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (grade_id) REFERENCES grades(id),
      FOREIGN KEY (section_id) REFERENCES sections(id)
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS teachers (
      id ${autoInc},
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS teacher_assignments (
      id ${autoInc},
      teacher_id INT NOT NULL,
      subject_id INT NOT NULL,
      section_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
      UNIQUE (teacher_id, subject_id, section_id)
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS assessment_tasks (
      id ${autoInc},
      title VARCHAR(255) NOT NULL,
      description TEXT,
      task_type VARCHAR(20) NOT NULL,
      subject_id INT NOT NULL,
      section_id INT NOT NULL,
      teacher_id INT NOT NULL,
      attachment_path VARCHAR(255) NULL,
      due_date DATE NULL,
      has_solution TINYINT(1) DEFAULT 0,
      solution_text TEXT NULL,
      solution_attachment_path VARCHAR(255) NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    ) ${engineStr};`,

    `CREATE TABLE IF NOT EXISTS schedule_slots (
      id ${autoInc},
      section_id INT NOT NULL,
      day_of_week INT NOT NULL,
      slot_number INT NOT NULL,
      subject_id INT NOT NULL,
      teacher_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
      UNIQUE (section_id, day_of_week, slot_number)
    ) ${engineStr};`
  ];

  for (const query of queries) {
    await db.query(query);
  }

  console.log('🎉 Migrations finished successfully!');
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
