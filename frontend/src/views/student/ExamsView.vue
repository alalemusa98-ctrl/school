<template>
  <StudentLayout 
    pageTitle="جدول الامتحانات" 
    pageSubtitle="مواعيد الاختبارات الشهرية والتحصيلية"
    pageEmoji="📝"
  >
    <main class="hw-container">
      <div v-if="loading" class="loading-state">جاري استرجاع قائمة الامتحانات... ⏳</div>

      <div v-else>
        <div v-if="examsList.length === 0" class="empty-state">
          🎈 لا توجد امتحانات محددة حالياً لشعبتك!
        </div>

        <article 
          v-for="exam in examsList" 
          :key="exam.id" 
          class="hw-card"
        >
          <div class="hw-card-top">
            <div class="hw-subject-tag" :class="getSubjectTagClass(exam.subject_name)">
              <span class="sub-icon">{{ getSubjectIcon(exam.subject_name) }}</span>
              <span>{{ exam.subject_name || 'امتحان تحصيلي' }}</span>
            </div>
            <span class="hw-badge danger">3 أيام قادمة</span>
          </div>

          <div class="hw-card-body">
            <h3 class="hw-title">{{ exam.title }}</h3>
            <p class="hw-desc">{{ exam.description || 'امتحان تقييمي يشمل فصول المنهج المقررة.' }}</p>

            <div class="hw-meta-info">
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>الموعد: {{ exam.due_date ? formatDate(exam.due_date) : 'الخميس 13 أغسطس 2026' }}</span>
              </div>
              <div class="meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>الزمن: 09:00 صباحاً (ساعة ونصف)</span>
              </div>
            </div>
          </div>

          <div class="hw-card-footer">
            <button class="hw-submit-btn" @click="viewExamDetails(exam)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>تفاصيل الامتحان والمفردات</span>
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
const exams = ref([]);

const fallbackExams = [
  {
    id: 1,
    title: 'امتحان العلوم الشهر الأول',
    description: 'اختبار تحصيلي يشمل فصول الفيزياء الكيمياء والمفاهيم الأساسية.',
    subject_name: 'العلوم العامة',
    due_date: '2026-08-13'
  },
  {
    id: 2,
    title: 'امتحان الرياضيات النصف سنوي',
    description: 'تشمل أسئلة جبر وهندسة ومعادلات ص 10 إلى ص 60.',
    subject_name: 'الرياضيات',
    due_date: '2026-08-18'
  },
  {
    id: 3,
    title: 'اختبار النحو والقراءة',
    description: 'اختبار تحصيلي في قواعد اللغة العربية وقواعد الإعراب.',
    subject_name: 'اللغة العربية',
    due_date: '2026-08-22'
  }
];

const examsList = computed(() => {
  return exams.value.length > 0 ? exams.value : fallbackExams;
});

function getSubjectId(name) {
  if (!name) return 'other';
  if (name.includes('رياضيات')) return 'math';
  if (name.includes('علوم')) return 'science';
  if (name.includes('عرب')) return 'arabic';
  if (name.includes('إنكليز') || name.includes('إنجليزية')) return 'english';
  return 'other';
}

function getSubjectTagClass(name) {
  return getSubjectId(name);
}

function getSubjectIcon(name) {
  const id = getSubjectId(name);
  if (id === 'math') return '📐';
  if (id === 'science') return '🔬';
  if (id === 'arabic') return '📖';
  if (id === 'english') return '🔤';
  return '📝';
}

function formatDate(d) {
  return d;
}

function viewExamDetails(exam) {
  alert(`تفاصيل ${exam.title}: يرجى إحضار الأدوات الهندسية والحضور قبل موعد الاختبار بـ 15 دقيقة.`);
}

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks?task_type=EXAM');
    if (res.data.success && res.data.data.length > 0) {
      exams.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch exams:', err);
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
</style>
