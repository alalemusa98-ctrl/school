# الخطوة 2ب: نقاط البرمجة الخاصة بالطالب (Student Data APIs)

> **الهدف:** توفير واجهات برمجة خلفية مخصصة ومحمية للطالب، تضمن استرجاع الواجبات، الامتحانات، المواد، والجدول الأسبوعي المخصص لشعبته وصَفّه حصرياً دون تداخل مع بقية الشعب (مثال: طالب شعبة 5أ يرى فقط محتوى 5أ).

---

## 📡 1. كيفية التصفية والحماية (Authentication & Data Isolation)

جميع المسارات في هذا الملف تتطلب إرسال الـ Token الخاص بالطالب في الـ Header (`Authorization: Bearer <token>`).
يقوم الـ Middleware (`verifyStudentToken`) باستخراج `section_id` و `grade_id` الخاص بالطالب من التوكين وتصفية الاستعلامات تلقائياً.

---

## 🌐 2. قائمة المسارات الخاصة بالطالب (Student Endpoints)

### 2.1 جلب الجدول الدراسي الخاص بطالب الشعبة (My Schedule)
* **المسار:** `GET /api/student/my-schedule`
* **الوصف:** جلب حصص الأسبوع لشعبة الطالب الحالية فقط.
* **استعلام قاعدة البيانات (Query Logic):**
  `SELECT * FROM schedule_slots WHERE section_id = student.section_id ORDER BY day_of_week, slot_number`

### 2.2 جلب الواجبات الخاصة بشعبة الطالب (My Homeworks)
* **المسار:** `GET /api/student/my-homeworks`
* **الوصف:** جلب جميع الواجبات المطلوبة من شعبة الطالب مرتبة من الأحدث للأقدم.
* **استعلام قاعدة البيانات (Query Logic):**
  `SELECT * FROM assessment_tasks WHERE section_id = student.section_id AND task_type = 'HOMEWORK' ORDER BY created_at DESC`

### 2.3 جلب الامتحانات الخاصة بشعبة الطالب (My Exams)
* **المسار:** `GET /api/student/my-exams`
* **الوصف:** جلب جميع الامتحانات المخصصة لشعبة الطالب.
* **استعلام قاعدة البيانات (Query Logic):**
  `SELECT * FROM assessment_tasks WHERE section_id = student.section_id AND task_type = 'EXAM' ORDER BY created_at DESC`

### 2.4 جلب المواد الدراسية الخاصة بصف الطالب (My Subjects)
* **المسار:** `GET /api/student/my-subjects`
* **الوصف:** جلب قائمة المواد الدراسية المحددة لصف الطالب (مثل جميع مواد الصف الخامس).
* **استعلام قاعدة البيانات (Query Logic):**
  `SELECT * FROM subjects WHERE grade_id = student.grade_id`

### 2.5 جلب واجبات وامتحانات مادة محددة (Subject Tasks Filter)
* **المسار:** `GET /api/student/subjects/:subject_id/tasks`
* **الوصف:** جلب الواجبات والامتحانات الخاصة بمادة معينة لشعبة الطالب فقط، لتسهيل متابعة مادة محددة.

---

## ✅ معيار اكتمال هذه الخطوة:
- [ ] تجربة طلب `GET /api/student/my-schedule` برمز طالب من شعبة 5أ والتأكد من إرجاع جدول 5أ فقط.
- [ ] تجربة طلب نفس المسار برمز طالب من شعبة 5ب والتأكد من إرجاع جدول 5ب فقط دون أي تداخل.
- [ ] إخفاء أزرار وروابط الحلول النموذجية إن لم يكن للمعلم حل مرفق.
