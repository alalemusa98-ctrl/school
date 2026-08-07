# دليل مراحل تنفيذ مشروع نظام إدارة المدرسة (Steps Overview)

هذا المجلد يحتوي على الخطوات والمراحل التنفيذية المحددة لبناء المشروع خطوة بخطوة بطريقة منظمة، تتيح معرفة مكان الإنجاز ونسبة التقدم في أي لحظة.

---

## 📌 الفلسفة العامة للبناء:

1. **الخلفية البرمجية (Backend):** هيكلية عامة ونظيفة خالية من التعقيد ومتواقة مع أي لغة برمجة (Node.js/Express, Python/FastAPI, PHP/Laravel, Go, إلخ).
2. **الواجهة الأمامية (Frontend):** مبنية باستخدام **Vue.js 3** بالكامل.
3. **تجربة المستخدم (UI/UX - مخصصة للأطفال):**
   - **الابتعاد التام عن "التابات" (Tabs):** لتجنب التشتت والتعقيد.
   - **الاعتماد الكلي على "البطاقات" (Cards):** عناصر مرئية كبرى، واضحة، سهلة الضغط والمتابعة للطالب.
   - **مبدأ المكونات (Component-Driven Architecture):** تقسيم الواجهة لمكونات Vue صغيرة وقابلة لإعادة الاستخدام للتحكم التام بالتنسيق.

---

## 🗺️ جدول مراحل التنفيذ:

| المرحلة | الملف | الوصف الإجمالي |
| :--- | :--- | :--- |
| **المرحلة 1** | [step1_backend_base.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step1_backend_base.md) | هيكلية الخلفية البرمجية وتأسيس قاعدة البيانات والجداول الأساسية. |
| **المرحلة 2أ** | [step2_auth_api.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step2_auth_api.md) | واجهات البرمجة (APIs) لتسجيل الدخول والتحقق من الهوية والأدوار. |
| **المرحلة 2ب** | [step2b_student_api.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step2b_student_api.md) | واجهات برمجة الطالب الخاصة لاسترجاع جدوله وواجباته ومواده لشعبته حصرياً. |
| **المرحلة 3** | [step3_admin_api.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step3_admin_api.md) | واجهات برمجة الإدارة (الصفوف، الشعب، المواد، الطلاب، المعلمين، الجداول). |
| **المرحلة 4** | [step4_teacher_api.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step4_teacher_api.md) | واجهات برمجة المعلم (إنشاء وتعديل الواجبات، الامتحانات، وإرفاق الحلول). |
| **المرحلة 5** | [step5_frontend_setup.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step5_frontend_setup.md) | تأسيس مشروع Vue.js ومكونات البطاقات والنظام التصميمي البصري. |
| **المرحلة 6** | [step6_student_frontend.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step6_student_frontend.md) | بناء واجهات الطالب بطريقة البطاقات (الواجبات، الامتحانات، الجدول، المواد). |
| **المرحلة 7** | [step7_teacher_frontend.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step7_teacher_frontend.md) | بناء واجهات المعلم لإدراج وإدارة الواجبات والامتحانات والحلول. |
| **المرحلة 8** | [step8_admin_frontend.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step8_admin_frontend.md) | بناء واجهات الإدارة لإدارة الهيكل والطلاب والمعلمين وبناء الجدول الأسبوعي. |
| **المرحلة 9** | [step9_integration_testing.md](file:///c:/Users/alhareth/Desktop/work/%D9%85%D8%B4%D8%B1%D9%88%D8%B9/steps/step9_integration_testing.md) | الربط الكامل والتكامل واختبار النظام النهائي للتشغيل الميداني. |
