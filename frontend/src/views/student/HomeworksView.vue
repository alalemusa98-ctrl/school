<template>
  <StudentLayout 
    pageTitle="تفاصيل الواجبات" 
    pageSubtitle="متابعة الواجبات والحلول النموذجية"
    pageEmoji="📚"
  >
    <!-- Segmented Control Tab Switcher -->
    <section class="hw-filter-section">
      <div class="hw-segmented-control">
        <button 
          class="hw-tab-btn" 
          :class="{ active: activeTab === 'current' }" 
          @click="activeTab = 'current'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>الواجبات الحالية</span>
          <span class="hw-count-badge">{{ currentHomeworks.length }}</span>
        </button>

        <button 
          class="hw-tab-btn" 
          :class="{ active: activeTab === 'previous' }" 
          @click="activeTab = 'previous'"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>الأرشيف</span>
        </button>
      </div>

      <!-- Quick Subject Filter Pills -->
      <div class="subject-pills-row">
        <button 
          class="sub-pill" 
          :class="{ active: selectedSubject === 'ALL' }" 
          @click="selectedSubject = 'ALL'"
        >
          الكل
        </button>
        <button 
          v-for="sub in subjectOptions" 
          :key="sub.id"
          class="sub-pill"
          :class="{ active: selectedSubject === sub.id }"
          @click="selectedSubject = sub.id"
        >
          {{ sub.icon }} {{ sub.name }}
        </button>
      </div>
    </section>

    <!-- Main Homework List Container -->
    <main class="hw-container">
      <div v-if="loading" class="loading-state">جاري استرجاع الواجبات المدرسية... ⏳</div>

      <!-- Current Homeworks List -->
      <div v-else-if="activeTab === 'current'">
        <div v-if="filteredCurrentHomeworks.length === 0" class="empty-state">
          🎉 لا توجد واجبات معلقة حالياً في هذا القسم. أنت رائع!
        </div>

        <article 
          v-for="hw in filteredCurrentHomeworks" 
          :key="hw.id" 
          class="hw-card-ref"
        >
          <!-- 1. Card Top Header (Title Only) -->
          <div class="hw-ref-header">
            <h3 class="hw-ref-title">{{ hw.title }}</h3>
          </div>

          <!-- 2. Teacher & Subject Row (Avatar + Verified Pill) -->
          <div class="hw-ref-profile-row">
            <div class="hw-ref-avatar">
              {{ getSubjectIcon(hw.subject_name) }}
            </div>
            <div class="hw-ref-profile-info">
              <span class="hw-ref-teacher-name">{{ hw.teacher_name || 'أستاذ المادة' }}</span>
              <span class="hw-ref-verified-pill" :class="{ pending: !hw.has_solution }">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>{{ hw.has_solution ? 'تم توفير الحل النموذجي' : 'الحل النموذجي قيد التوفير' }}</span>
              </span>
            </div>
          </div>

          <!-- 3. Recessed Light Purple Box -->
          <div class="hw-ref-inner-box">
            <span class="hw-ref-inner-label">محتوى وتفاصيل الواجب</span>
            <p class="hw-desc">{{ hw.description }}</p>

            <div class="hw-ref-stats-grid">
              <div class="hw-ref-stat-col">
                <div class="hw-ref-stat-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>حالة التسليم</span>
                </div>
                <span class="hw-ref-stat-val">{{ hw.submitted ? '✓ تم إرسال الحل' : '⏳ معلق - قيد الحل' }}</span>
              </div>

              <div class="hw-ref-stat-col">
                <div class="hw-ref-stat-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span>الملف المرفق</span>
                </div>
                <span class="hw-ref-stat-val">{{ hw.attachment_name || 'تمرين_الواجب.pdf' }}</span>
              </div>
            </div>
          </div>

          <!-- 4. Key-Value Info Rows -->
          <div class="hw-ref-meta-rows">
            <div class="hw-ref-meta-row">
              <span class="hw-ref-meta-key">المادة الدراسية</span>
              <span class="hw-ref-meta-val">{{ hw.subject_name || 'مادة علمية' }}</span>
            </div>
            <div class="hw-ref-meta-row">
              <span class="hw-ref-meta-key">تاريخ التسليم الأقصى</span>
              <span class="hw-ref-meta-val">{{ hw.due_date ? formatDate(hw.due_date) : 'غداً (10 أغسطس 2026)' }}</span>
            </div>
          </div>

          <!-- 5. Action Footer Row (Model Solution Button Only) -->
          <div class="hw-ref-footer">
            <button 
              class="hw-ref-primary-pill-btn full-width" 
              :disabled="!hw.has_solution" 
              :class="{ disabled: !hw.has_solution }"
              @click="viewModelSolution(hw)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>{{ hw.has_solution ? 'عرض الحل النموذجي' : 'عرض الحل النموذجي (غير متاح)' }}</span>
            </button>
          </div>
        </article>
      </div>

      <!-- Archive / Previous Homeworks List -->
      <div v-else>
        <div v-if="filteredArchiveHomeworks.length === 0" class="empty-state">
          لا توجد واجبات مؤرشفة في السجل حالياً.
        </div>

        <article 
          v-for="hw in filteredArchiveHomeworks" 
          :key="hw.id" 
          class="hw-card-ref"
        >
          <!-- 1. Card Top Header -->
          <div class="hw-ref-header">
            <h3 class="hw-ref-title">{{ hw.title }}</h3>
          </div>

          <!-- 2. Teacher Row -->
          <div class="hw-ref-profile-row">
            <div class="hw-ref-avatar">
              {{ getSubjectIcon(hw.subject_name) }}
            </div>
            <div class="hw-ref-profile-info">
              <span class="hw-ref-teacher-name">{{ hw.teacher_name || 'أ. مريم الفيتوري' }}</span>
              <span class="hw-ref-verified-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>تم التقييم والحل النموذجي</span>
              </span>
            </div>
          </div>

          <!-- 3. Recessed Box -->
          <div class="hw-ref-inner-box">
            <span class="hw-ref-inner-label">ملاحظة وتقييم المعلم</span>
            <p class="hw-desc">"{{ hw.feedback || 'ممتاز جداً! إجابة كاملة ودقيقة وأسلوب ممتاز.' }}"</p>

            <div class="hw-ref-stats-grid">
              <div class="hw-ref-stat-col">
                <div class="hw-ref-stat-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>الدرجة المستحقة</span>
                </div>
                <span class="hw-ref-stat-val">{{ hw.score || '10 / 10 🌟' }}</span>
              </div>

              <div class="hw-ref-stat-col">
                <div class="hw-ref-stat-title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>الحالة</span>
                </div>
                <span class="hw-ref-stat-val">مكتمل في الأرشيف</span>
              </div>
            </div>
          </div>

          <!-- 4. Meta Details Key-Value Rows -->
          <div class="hw-ref-meta-rows">
            <div class="hw-ref-meta-row">
              <span class="hw-ref-meta-key">المادة الدراسية</span>
              <span class="hw-ref-meta-val">{{ hw.subject_name }}</span>
            </div>
            <div class="hw-ref-meta-row">
              <span class="hw-ref-meta-key">تاريخ التسليم</span>
              <span class="hw-ref-meta-val">{{ formatDate(hw.due_date) }}</span>
            </div>
          </div>

          <!-- 5. Action Footer Row (Model Solution Button Only) -->
          <div class="hw-ref-footer">
            <button 
              class="hw-ref-primary-pill-btn full-width"
              :disabled="!hw.has_solution"
              :class="{ disabled: !hw.has_solution }"
              @click="viewModelSolution(hw)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{{ hw.has_solution ? 'عرض الحل النموذجي' : 'عرض الحل النموذجي (غير متاح)' }}</span>
            </button>
          </div>
        </article>
      </div>
    </main>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
import api from '../../services/api';

const loading = ref(true);
const activeTab = ref('current');
const selectedSubject = ref('ALL');
const homeworks = ref([]);

const subjectOptions = [
  { id: 'math', name: 'الرياضيات', icon: '📐' },
  { id: 'science', name: 'العلوم', icon: '🔬' },
  { id: 'arabic', name: 'العربية', icon: '📖' },
  { id: 'english', name: 'الإنجليزية', icon: '🔤' }
];

const fallbackCurrentHomeworks = [
  {
    id: 101,
    title: 'تمارين ص 45 (معادلات الدرجة الأولى)',
    description: 'حل التمارين رقم (1، 3، 5، 7) في كراسة الواجبات مع كتابة خطوات الحل بالكامل والتأكد من صحة النتائج.',
    subject_name: 'الرياضيات',
    due_date: '2026-08-10',
    teacher_name: 'أ. أحمد سالم',
    attachment_name: 'ورقة_عمل_المعادلات.pdf',
    statusText: 'معلق - مطلوب تسليمه',
    submitted: false,
    has_solution: true,
    solution_url: '/solutions/math_ex45.pdf'
  },
  {
    id: 102,
    title: 'تقرير تجربة دورة الماء والتبخر',
    description: 'كتابة ملخص تجربة المعمل حول مراحل التبخر والتكثف وتأثير الحرارة، مرفق برسم توضيحي لدورة الماء في الطبيعة.',
    subject_name: 'العلوم العامة',
    due_date: '2026-08-13',
    teacher_name: 'أ. فاطمة العبيدي',
    attachment_name: 'رسم_توضيحي_المعمل.png',
    statusText: 'قيد المراجعة والمعاينة',
    submitted: true,
    has_solution: false,
    solution_url: null
  },
  {
    id: 103,
    title: 'إعراب سورة النبأ (الأيات 1-10)',
    description: 'استخراج الفاعل والمفعول به والأفعال الماضية والمضارعة من السورة الكريمة وكتابتها في كراسة النحو والصرف.',
    subject_name: 'اللغة العربية',
    due_date: '2026-08-16',
    teacher_name: 'أ. عمر الشريف',
    attachment_name: 'جدول_القواعد_الإعرابية.pdf',
    statusText: 'جديد',
    submitted: false,
    has_solution: true,
    solution_url: '/solutions/arabic_neba.pdf'
  }
];

const fallbackArchiveHomeworks = [
  {
    id: 201,
    title: 'Unit 3: Past Simple Grammar Exercises',
    description: 'حل أسئلة القواعد بكتاب النشاط صفحة 22 وإرسال صورة الحل.',
    subject_name: 'اللغة الإنجليزية',
    due_date: '2026-08-05',
    teacher_name: 'أ. مريم الفيتوري',
    score: '10 / 10 🌟',
    feedback: 'ممتاز جداً! خط واضح وإجابات دقيقة وإتقان تام للقواعد. أحسنت! 👏',
    has_solution: true,
    solution_url: '/solutions/english_unit3.pdf'
  }
];

const currentHomeworks = computed(() => {
  return homeworks.value.length > 0 ? homeworks.value.map(hw => ({
    ...hw,
    has_solution: hw.has_solution ?? Boolean(hw.solution_url)
  })) : fallbackCurrentHomeworks;
});

const archiveHomeworks = computed(() => {
  return fallbackArchiveHomeworks;
});

const filteredCurrentHomeworks = computed(() => {
  if (selectedSubject.value === 'ALL') return currentHomeworks.value;
  return currentHomeworks.value.filter(hw => getSubjectId(hw.subject_name) === selectedSubject.value);
});

const filteredArchiveHomeworks = computed(() => {
  if (selectedSubject.value === 'ALL') return archiveHomeworks.value;
  return archiveHomeworks.value.filter(hw => getSubjectId(hw.subject_name) === selectedSubject.value);
});

function getSubjectId(name) {
  if (!name) return 'other';
  if (name.includes('رياضيات')) return 'math';
  if (name.includes('علوم')) return 'science';
  if (name.includes('عرب')) return 'arabic';
  if (name.includes('إنكليز') || name.includes('إنجليزية') || name.includes('English')) return 'english';
  return 'other';
}

function getSubjectIcon(name) {
  const id = getSubjectId(name);
  if (id === 'math') return '📐';
  if (id === 'science') return '🔬';
  if (id === 'arabic') return '📖';
  if (id === 'english') return '🔤';
  return '📚';
}

function formatDate(dateStr) {
  if (!dateStr) return 'غداً';
  return dateStr;
}

function viewModelSolution(hw) {
  if (!hw.has_solution) return;
  alert(`💡 الحل النموذجي لمادة (${hw.subject_name}):\n\n- ${hw.title}\n- تم إرفاق حل التمارين التفصيلي خطوة بخطوة.`);
}

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks?task_type=HOMEWORK');
    if (res.data.success && res.data.data.length > 0) {
      homeworks.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch homeworks:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.loading-state, .empty-state {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  font-weight: 700;
  color: #64748b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.full-width {
  width: 100%;
}
</style>
