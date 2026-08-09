# 🎨 دليل مواصفات ونظام التصميم لتطبيق الطالب (Design System & UI/UX Specs)

> **الوثيقة المرجعية الرسمية للهندسة البصرية وتجربة المستخدم (UI/UX Architecture Reference)**  
> **الإصدار:** 1.0.0 | **المؤلف:** فريق تصميم وتطوير الواجهات | **المجال:** منصة مدرسة النور - تطبيق الطالب

---

## 📐 1. الرؤية وفلسفة التصميم (Design Philosophy & Vision)

يعتمد تصميم واجهة الطالب على **هندسة تطبيقات iOS الحديثة (Apple iOS Native Guidelines)** مدمجة مع أسلوب **الزجاج الضبابي (Glassmorphic Minimalism)** والمميزات التفاعلية المتطورة:

1. **النهج الموجه للموبايل (Mobile-First Architecture):**  
   تم تصميم كافة المكونات لتناسب الشاشات الذكية مع مرونة التكيف التلقائي للأجهزة اللوحية والمكتبية.
2. **العمق البصري والطبقات المتراكبة (Layered Depth & Overlapping Cards):**  
   استخدام بطاقات floating بطبقات متراكبة لكسر الجمود البصري ومنح المستخدم إحساساً بالعمق والأبعاد (3D Depth).
3. **التصميم التفاعلي الناعم (Micro-Interactions & Haptic-like Transitions):**  
   كافة العناصر التفاعلية تمنح ردود فعل بصرية فورية (Hover, Active Scaling, Glass Glow) تُحاكي اللمس في التطبيقات الأصلية.
4. **دعم اللغة العربية والخطوط المخصصة (Native Arabic Typography):**  
   اعتماد خط **Apple SF Arabic** لإبراز الهوية العربية بأقصى درجات الوضوح والفخامة.

---

## 🎨 2. منظومة الألوان والرموز البصرية (Color System & Visual Tokens)

### أ. الألوان الأساسية والتدرجات (Brand Colors & Gradients)

| الرمز | الدرجة / التدرج | الاستخدام |
| :--- | :--- | :--- |
| **Header Gradient** | `linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #4f46e5 100%)` | الهيدر العلوي والخلفيات الرئسية |
| **Active Day Gradient** | `linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)` | التحديد النشط للأيام والعناصر المميزة |
| **Body Background** | `linear-gradient(180deg, #f8f5ff 0%, #f0f7ff 100%)` | خلفية التطبيق العامة |
| **Avatar Background** | `linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)` | خلفيات الصورة الرمزية والأيقونات |
| **Card Overlay** | `linear-gradient(180deg, rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.94))` | التعتيم التدريجي فوق صور البطاقات |

---

### ب. ألوان الحالات والبطاقات (Semantic & Status Colors)

```css
/* Warning / معلق */
--badge-warning-bg: rgba(254, 243, 199, 0.94);
--badge-warning-text: #b45309;
--badge-warning-border: rgba(253, 230, 138, 0.8);

/* Danger / قادم عاجل */
--badge-danger-bg: rgba(254, 226, 226, 0.94);
--badge-danger-text: #b91c1c;
--badge-danger-border: rgba(254, 202, 202, 0.8);

/* Info / معلوماتي */
--badge-info-bg: rgba(224, 231, 255, 0.94);
--badge-info-text: #3730a3;
--badge-info-border: rgba(199, 210, 254, 0.8);

/* Success / مكتمل أو نشط */
--badge-success-bg: rgba(209, 250, 229, 0.94);
--badge-success-text: #047857;
--badge-success-border: rgba(167, 243, 208, 0.8);
```

---

### ج. تأثرات الزجاج والشفافية (Glassmorphic Specifications)

```css
.glass-element {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.28);
}
```

---

## 🔤 3. نظام الطباعة والتسلسل الهرمي (Typography System)

يعتمد التطبيق نظام الخطوط المخصص المتضمن في مجلد `fonts/`:

```css
@font-face {
  font-family: 'SF Arabic';
  src: url('fonts/SF-Arabic-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family: 'SF Arabic';
  src: url('fonts/SF-Arabic-SemiBold.ttf') format('truetype');
  font-weight: 600 800;
}
```

### التسلسل الهرمي للأحجام (Typography Scale)

* **العناوين الرئيسية (Page Nav Titles):** `17px` | `Font-Weight: 800` | `Color: #ffffff`
* **عناوين البطاقات البارزة (Hero Title):** `17px` | `Font-Weight: 800` | `Color: #0f172a`
* **عناوين الكروت (Card Headers):** `16px` | `Font-Weight: 800` | `Color: #ffffff`
* **النصوص الفرعية (Subtitles):** `12px - 14px` | `Font-Weight: 600 - 700` | `Color: #6366f1 / #64748b`
* **المؤشرات والشارات (Badges & Stats):** `10px - 11px` | `Font-Weight: 800` | `Letter-spacing: -0.1px`

---

## 🧩 4. تفاصيل المكونات الرئيسية (Core Components Blueprint)

### 1️⃣ الهيدر العلوي بنمط iOS (iOS Mobile Header & Status Bar)
* **المكونات:**
  * **Dynamic Island Mock:** بعرض `90px` وارتفاع `18px` ولون `#0f172a` مع عدسة كاميرا دائرية.
  * **iOS Status Bar:** وقت النظام `9:41` وأيقونات الإشارة والتغطية والبطارية بصيغة SVG ناعمة.
  * **Navigation Bar:** يحتوي على زر العودة الزجاجي (`glass-icon-btn`) وأزرار المشاركة والمفضلة.

---

### 2️⃣ البطاقة الرئيسية البارزة المتداخلة (Floating Hero Overlapping Card)
* **الفكرة المعمارية:** البطاقة تتداخل مع الهيدر العلوي بمسافة `-50px` أعلى الهيدر، مما يخلق بعداً بصرياً ممتازاً.
* **المحتويات:**
  * الصورة الرمزية للمدرسة (`hero-avatar`) مع مؤشر حالة الاتصال المضيء باللون الأخضر (`hero-status-dot`).
  * تفاصيل المدرسة والصف الدراسي.
  * **شريط الإحصائيات السريع (Hero Stats Row):** يقسم إلى 3 أعمدة (عدد المواد، عدد الطلاب، التقييم) مفصولة بخطوط تفكيك ناعمة (`stat-divider`).

---

### 3️⃣ شريط الأيام والحضور (Attendance Calendar Strip)
* **الشكل والتفاعل:** شريط أفقي يحتوي على بطاقات الأيام (`day-card`).
* **اليوم النشط (`.active`):** يتميز خلفية بنفسجية متدرجة مضيئة (`#a855f7` إلى `#8b5cf6`) مع إضاءة ظلال ناعمة (`box-shadow: 0 8px 22px rgba(139, 92, 246, 0.35)`).

---

### 4️⃣ شبكة البطاقات الرئيسية (Cards Grid Architecture)
* **التوزيع:** `grid-template-columns: repeat(2, 1fr)` بفراغات `14px`.
* **ارتفاع البطاقة:** `240px` بإنحناء حواف `24px`.
* **صور الخلفية والتدرج:**
  * استخدام صور بدقة عالية متناسبة مع نوع القسم (واجبات، امتحانات، مواد، جدول).
  * إضافة تدرج غامق أسفل الصورة لضمان مقروئية النص الأبيض.
  * عند الإشارة (`:hover`) تكبر الصورة بنسبة `1.08` بتأثير سائل `cubic-bezier(0.16, 1, 0.3, 1)`.

---

### 5️⃣ شريط التنقل السفلي العائم (Floating Bottom Navigation Dock)
* **التصميم:** شريط مثبت أسفل الشاشة (`position: fixed; bottom: 16px`) بتصميم كبسولة زجاجية عائمة.
* **الأيقونات والتنقل:** يحتوي على 5 عناصر رئيسية (الرئيسية، المواد، الجدول، التنبيهات، حسابي).
* **العنصر النشط:** يرتفع لأعلى بمقدار `-4px` ويتحول اللون للبنفسجي المضيء `#7c3aed` مع نقطة تنبيه تحت الأيقونة.

---

### 6️⃣ عناصر الصفحات الفرعية والواجبات (Sub-page UI Components)
* **المبدل المنفصل (Segmented Control):** زر تبديل زجاجي مقسم بين "الواجبات الحالية" و "الأرشيف".
* **حبوب التصفية السريعة (Subject Pills):** أزرار مستديرة لتصفية المحتوى حسب المادة (`📐 الرياضيات`, `🔬 العلوم`, `📖 العربية`).

---

## ⚡ 5. التفاعلات والحركات (Animations & Micro-Interactions)

| التفاعل | الانتقال الزمني (Transition) | التأثير البصري |
| :--- | :--- | :--- |
| **Card Hover** | `0.35s cubic-bezier(0.16, 1, 0.3, 1)` | ارتفاع `-4px` وتكبير بنسبة `1.015` مع زيادة الظل |
| **Card Click (Active)** | `0.15s ease` | انكماش هادئ بنسبة `scale(0.97)` |
| **Glass Button Hover** | `0.25s ease` | زيادة الشفافية وتكبير `scale(1.05)` |
| **Image Zoom** | `0.6s cubic-bezier(0.16, 1, 0.3, 1)` | تكبير الصورة الداخلية بنسبة `1.08` |

---

## 💻 6. توجيهات المطور للتطبيق البرمجي (Developer Implementation Guide)

عند تحويل هذا التصميم إلى أطر عمل مثل (React / Next.js / Vue / Flutter / Laravel Blade)، يرجى الالتزام بالتعليمات التالية:

1. **الالتزام بالـ CSS Variables:** عدم استخدام ألوان ثابتة ومستقلة، بل ربط جميع الألوان بالمتغيرات المحددة في ملف `styles.css`.
2. **استخدام الصور بدقة مناسبة:** التأكد من حفظ وتصدير الصور في مجلد `صور/` بصيغة WebP أو PNG مضغوطة عالية الجودة.
3. **تطبيق قواعد التجاوب (Responsiveness):**
   * على الشاشات الصغرى (< 380px): تتحول شبكة البطاقات إلى عمود واحد إذا لزم الأمر.
   * على الشاشات الكبيرة (> 768px): يحدد العرض الأقصى للواجهة بـ `480px` أو `600px` وتوسيطها لتبقى بمظهر تطبيق هاتف راقي.
4. **توفير دعم حالات التحميل (Skeleton Loaders):** إعداد كروت رمادية متحركة بنفس أبعاد البطاقات لحين تحميل البيانات من الـ API backend.

---

> **ملاحظة:** هذا الملف يعتبر الدليل المعياري الشامل لأي تعديلات أو إضافات مستقبلية على واجهات الطالب.
