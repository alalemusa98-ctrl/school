# الخطوة 5: تأسيس مشروع Vue.js والنظام التصميمي القائم على البطاقات (Frontend Setup & Cards Design System)

> **الهدف:** إنشاء مشروع **Vue.js 3** حديث، وتطوير مكتبة مكونات (Vue Components) تعتمد على **نظام البطاقات (Card-Based Architecture)** والابتعاد التام عن التابات (No Tabs) لتوفير أسهل تجربة مستخدم للأطفال.

---

## 🛠️ 1. هيكلية مجلدات Vue.js الموصى بها

```
frontend/
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── main.css           # المتغيرات والتنسيقات العامة
│   │   │   └── typography.css     # الخطوط وأحجام النصوص الواضحة
│   │   └── images/
│   ├── components/                # المكونات الأساسية لإعادة الاستخدام (Cards & Buttons)
│   │   ├── common/
│   │   │   ├── BaseCard.vue       # بطاقة أساسية بتأثيرات بصرية وحواف دائرية
│   │   │   ├── BaseButton.vue     # أزرار كبيرة واضحة للأطفال
│   │   │   ├── BaseBadge.vue      # شارات توضيحية (مثل: واجب جديد، حل متوفر)
│   │   │   └── AppHeader.vue      # شريط رأسي بسيط
│   │   ├── student/
│   │   │   ├── TaskCard.vue       # بطاقة الواجب/الامتحان للطالب
│   │   │   ├── ScheduleCard.vue   # بطاقة حصة جدول
│   │   │   └── SubjectCard.vue    # بطاقة مادة دراسية بقرنية بصرية
│   │   └── teacher/
│   │       └── TeacherTaskCard.vue
│   ├── views/                     # الصفحات الرئيسية
│   │   ├── auth/
│   │   │   └── StudentLoginView.vue
│   │   ├── student/
│   │   │   ├── StudentDashboardView.vue
│   │   │   ├── HomeworksView.vue
│   │   │   ├── ExamsView.vue
│   │   │   ├── ScheduleView.vue
│   │   │   └── SubjectsView.vue
│   │   ├── teacher/
│   │   └── admin/
│   ├── router/                    # توجيه الصفحات (Vue Router)
│   ├── stores/                    # إدارة الحالة (Pinia / Vuex)
│   └── services/                  # الاتصال بالـ Backend (Axios API Client)
```

---

## 🎨 2. القواعد التصميمية الصارمة (Design Guidelines for Kids)

1. **الابتعاد عن التابات (No Tabs):** بدلاً من وضع تابات علوية صغيرة، نستخدم **بطاقات تنقل كبيرة (Navigation Cards)** ذات أيقونات ملونة جليّة في الصفحة الرئيسية.
2. **البطاقات بدلاً من الجداول والتكديس (Card-Centric UI):** كل واجب، مادة، امتحان، أو حصة في الجدول يُمثَّل ببطاقة `BaseCard.vue` مستقلة ذات حواف دائرية ناعمة، وظل خفيف، وألوان مبهجة ومريحة للعين.
3. **الاعتماد على المكونات (Component-First):** لا يُسمح بتكرار تنسيق بطاقة يدوياً؛ كل شيء يُبنى عبر استدعاء مكونات Vue مخصصة.
4. **خطوط وأزرار كبيرة:** أحجام نصوص واضحة وسهلة القراءة للأطفال في المرحلة الأساسية (1-9).

---

## 🧩 3. مثال لمكون البطاقة الأساسية (`BaseCard.vue`)

```vue
<template>
  <div class="base-card" :class="{ 'clickable': isClickable }" @click="handleClick">
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div class="card-body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isClickable: { type: Boolean, default: false }
});
const emit = defineEmits(['click']);
function handleClick() {
  emit('click');
}
</script>

<style scoped>
.base-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 2px solid #f0f2f5;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.base-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
```

---

## ✅ معيار اكتمال الخطوة 5:
- [ ] تهيئة مشروع Vue.js 3 وإعداد Vue Router.
- [ ] بناء المكونات الأساسية: `BaseCard.vue`, `BaseButton.vue`, `BaseBadge.vue`.
- [ ] إعداد الملفات النمطية والتأكد من دعم اللغة العربية واتجاه الخط (RTL).
