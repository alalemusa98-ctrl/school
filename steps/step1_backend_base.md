# الخطوة 1: تأسيس هيكلية الخلفية البرمجية وقاعدة البيانات (Backend Base & Database)

> **الهدف:** إنشاء هيكلية مجلدات نظيفة ومستقلة عن أي لغة برمجة، وإعداد اتصال قاعدة البيانات، وتأمين جداول النظام وسكربت البيانات الأولية.

---

## 📁 1. الهيكلية العامة الموصى بها لمجلدات الـ Backend (Language-Agnostic)

أياً كانت التكنولوجيا المختارة (Node.js / Python / Go / PHP / C#)، يجب أن تتبع الخلفية البرمجية هذه الهيكلية المنظمة:

```
backend/
├── config/                  # إعدادات الاتصال بقاعدة البيانات والمتغيرات البيئية (.env)
├── controllers/             # استلام الطلبات من الـ Router ومعالجة الإدخالات والردود
├── services/                # المنطق البرمجي الأساسي والتفاعلات المباشرة (Business Logic)
├── repositories/            # الاستعلامات المباشرة لقاعدة البيانات (Database Queries / ORM)
├── models/                  # تعريف هيكل الكيانات وقواعد البيانات (Entities / Schemas)
├── routes/                  # تعريف مسارات الـ API وتوجيهها للـ Controllers
├── middlewares/             # برمجيات التحقق من الجلسات (JWT Auth) والصلحيات والأخطاء
├── utils/                   # أدوات مساعدة (توليد الأكواد، رفع الملفات، التشفير)
├── uploads/                 # مجلد حفظ الملفات المرفقة (PDFs، الصور)
└── database/
    ├── migrations/          # سكربتات إنشاء وتحديث الجداول
    └── seeds/               # بيانات افتراضية أولية (الحساب الإداري، الصفوف 1-9)
```

---

## 🗄️ 2. جداول قاعدة البيانات المطلوب إنشاؤها (Database Schema)

يجب تنفيذه في ملفات الـ `migrations`:

1. `academic_years` (id, name)
2. `grades` (id, level, name)
3. `sections` (id, grade_id, name)
4. `subjects` (id, grade_id, name)
5. `students` (id, roll_number, student_code, full_name, grade_id, section_id)
6. `teachers` (id, username, password_hash, full_name)
7. `teacher_assignments` (id, teacher_id, subject_id, section_id)
8. `assessment_tasks` (id, title, description, task_type, subject_id, section_id, teacher_id, attachment_path, due_date, created_at, has_solution, solution_text, solution_attachment_path)
9. `schedule_slots` (id, section_id, day_of_week, slot_number, subject_id, teacher_id)

---

## 📌 3. البيانات الأولية المطلوب زراعتها (Seeds Script)

يجب تشغيل سكربت `seeds` لإضافة البيانات الأساسية تلقائياً:
- حساب الإدارة الرئيسي الأول (`admin` / `admin123`).
- الصفوف الدراسية التسعة من (الصف الأول) إلى (الصف التاسع).
- السنة الدراسية الحالية (مثال: `2025/2026`).

---

## ✅ معيار اكتمال الخطوة 1:
- [ ] مجلدات الـ Backend جاهزة ومقسمة.
- [ ] الاتصال بقاعدة البيانات يعمل بنجاح.
- [ ] تم تشغيل ملفات الـ Migrations وإنشاء الجداول الـ 9 بنجاح.
- [ ] تم زراعة البيانات الأولية (Seeds) الخاصة بالصفوف الحساب الإداري.
