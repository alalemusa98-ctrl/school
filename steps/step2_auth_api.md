# الخطوة 2: نقاط البرمجة الخاصة بالتحقق من الهوية والأدوار (Auth APIs)

> **الهدف:** توفير مسارات تسجيل دخول آمنة وسريعة لكل من: (1) الطالب بواسطة رقم الجلوس والكود، (2) المعلم والإدارة بواسطة اسم المستخدم وكلمة المرور.

---

## 📡 1. نقاط الاتصال المطلوبة (Endpoints Definition)

### 2.1 تسجيل دخول الطالب (Student Login)
* **المسار:** `POST /api/auth/student-login`
* **مدخلات الطلب (Body):**
  ```json
  {
    "roll_number": "1052",
    "student_code": "ST-9842"
  }
  ```
* **مخرجات الاستجابة (Response):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": 15,
      "role": "STUDENT",
      "full_name": "علي محمد أحمد",
      "grade_id": 5,
      "grade_name": "الصف الخامس",
      "section_id": 2,
      "section_name": "5أ"
    }
  }
  ```

### 2.2 تسجيل دخول المعلم والإدارة (Staff Login)
* **المسار:** `POST /api/auth/staff-login`
* **مدخلات الطلب (Body):**
  ```json
  {
    "username": "teacher_ali",
    "password": "my_secure_password"
  }
  ```
* **مخرجات الاستجابة (Response):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": {
      "id": 4,
      "role": "TEACHER", // أو "ADMIN"
      "full_name": "أستاذ علي سالم"
    }
  }
  ```

---

## 🔒 2. برمجيات الحماية الوسطى (Middlewares)

1. `verifyToken`: يفحص وجود وصلاحية الـ JWT Header.
2. `requireRole(role)`: يمنع الوصول للنقاط إلا بحسب دور المستخدم (`STUDENT`, `TEACHER`, `ADMIN`).

---

## ✅ معيار اكتمال الخطوة 2:
- [ ] تجربة تسجيل دخول طالب صحيح برقم جلوس وكود وملاحظة عودة بياناته وشعبته.
- [ ] تجربة تسجيل دخول طالب ببيانات خاطئة والتأكد من رفض الطلب.
- [ ] تجربة دخول حساب معلم وإدارة والحصول على رمز التوثيق (JWT Token).
- [ ] اختبار حماية المسارات برفض أي طلب لا يحتوي على رمز Token صالح.
