# الخطوة 3: نقاط البرمجة الخاصة بالإدارة (Admin Management APIs)

> **الهدف:** توفير واجهات برمجة خلفية تتيح للإدارة التهيئة الكاملة للمدرسة، إضافة الطلاب والمعلمين، وتوزيع الجداول.

---

## 📡 1. قائمة مسارات الإدارة (Endpoints List)

### 3.1 إدارة الصفوف والشعب والمواد (Academic Structure)
* `GET /api/admin/grades` : جلب قائمة الصفوف (1-9).
* `GET /api/admin/grades/:grade_id/sections` : جلب شعب صف معين.
* `POST /api/admin/sections` : إضافة شعبة جديدة (الصف، الاسم مثل: 5ج).
* `GET /api/admin/grades/:grade_id/subjects` : جلب مواد صف معين.
* `POST /api/admin/subjects` : إضافة مادة للصف.

### 3.2 إدارة الطلاب (Student Roster)
* `GET /api/admin/students` : جلب قائمة الطلاب (مع إمكانية الفلترة بالشعبة أو الصف).
* `POST /api/admin/students` : إضافة طالب جديد (الاسم، رقم الجلوس، الشعبة، وتوليد كود تلقائي).
* `PUT /api/admin/students/:id` : تعديل بيانات الطالب أو نقله لشعبة أخرى.
* `DELETE /api/admin/students/:id` : حذف طالب.

### 3.3 إدارة المعلمين والتكليفات (Teachers Roster & Assignments)
* `GET /api/admin/teachers` : جلب قائمة المعلمين.
* `POST /api/admin/teachers` : إنشاء حساب معلم جديد.
* `GET /api/admin/teachers/:id/assignments` : جلب قائمة الشعب والمواد الموكلة للمعلم.
* `POST /api/admin/teachers/assign` : تكليف معلم بمادة وشعبة (معلم + مادة + شعبة).

### 3.4 إدارة الجدول الدراسي الأسبوعي (Weekly Schedule Builder)
* `GET /api/admin/sections/:section_id/schedule` : جلب جدول شعبة معينة.
* `POST /api/admin/sections/:section_id/schedule` : حفظ/تحديث جدول الشعبة الأسبوعي.

---

## ✅ معيار اكتمال الخطوة 3:
- [ ] إمكانية إضافة الشعب والمواد للصفوف بنجاح.
- [ ] إمكانية إدخال طالب وتوليد كود الدخول الخاص به.
- [ ] إمكانية نقل طالب من شعبة إلى أخرى داخل الصف.
- [ ] إمكانية تكليف معلم بمادة وشعبة.
- [ ] إمكانية حفظ واسترجاع الجدول الأسبوعي لشعبة.
