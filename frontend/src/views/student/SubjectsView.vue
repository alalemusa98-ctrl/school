<template>
  <StudentLayout 
    pageTitle="المواد الدراسية" 
    pageSubtitle="المناهج المقررة والملخصات التعليمية"
    pageEmoji="📖"
  >
    <main class="hw-container">
      <div v-if="selectedSubject" class="subject-filter-banner">
        <span>تصفية مادة: <strong>{{ selectedSubject.name }}</strong></span>
        <button class="clear-filter-btn" @click="selectedSubject = null; fetchTasks(null);">
          إلغاء التصفية ❌
        </button>
      </div>

      <div v-if="loadingSubjects" class="loading-state">جاري تحميل المواد الدراسية... ⏳</div>

      <div v-else class="subjects-grid">
        <article 
          v-for="sub in subjectsList" 
          :key="sub.id" 
          class="hw-card subject-item-card"
          @click="selectSubject(sub)"
        >
          <div class="hw-card-top">
            <div class="hw-subject-tag" :class="getSubjectTagClass(sub.name)">
              <span class="sub-icon">{{ getSubjectIcon(sub.name) }}</span>
              <span>{{ sub.name }}</span>
            </div>
            <span class="hw-badge info">الصف الثامن</span>
          </div>

          <div class="hw-card-body">
            <h3 class="hw-title">مادة {{ sub.name }}</h3>
            <p class="hw-desc">{{ sub.description || 'المواضيع المقرر دراستها والحلول النموذجية.' }}</p>
            <div class="hw-meta-info" v-if="sub.teacher_name">
              <div class="meta-item teacher">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>{{ sub.teacher_name }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Filtered Tasks Result -->
      <div class="subject-tasks-section" v-if="selectedSubject">
        <h3 class="section-subtitle">واجبات ومستندات مادة {{ selectedSubject.name }}:</h3>
        <div v-if="loadingTasks" class="loading-state">جاري استرجاع البيانات... ⏳</div>
        <div v-else-if="tasks.length === 0" class="empty-state">
          🎉 لا توجد واجبات أو ملخصات مضافة لهذه المادة حالياً.
        </div>
        <div v-else class="tasks-grid">
          <article v-for="task in tasks" :key="task.id" class="hw-card">
            <div class="hw-card-body">
              <h3 class="hw-title">{{ task.title }}</h3>
              <p class="hw-desc">{{ task.description }}</p>
            </div>
          </article>
        </div>
      </div>
    </main>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
import api from '../../services/api';

const loadingSubjects = ref(true);
const loadingTasks = ref(false);
const subjects = ref([]);
const tasks = ref([]);
const selectedSubject = ref(null);

const fallbackSubjects = [
  { id: 1, name: 'الرياضيات', teacher_name: 'أ. أحمد سالم', description: 'الجبر والهندسة والمعادلات التفاضلية.' },
  { id: 2, name: 'العلوم العامة', teacher_name: 'أ. فاطمة العبيدي', description: 'الفيزياء والكيمياء والأحياء المعملية.' },
  { id: 3, name: 'اللغة العربية', teacher_name: 'أ. عمر الشريف', description: 'النحو والصرف والبلاغة وقواعد الإعراب.' },
  { id: 4, name: 'اللغة الإنجليزية', teacher_name: 'أ. مريم الفيتوري', description: 'Grammar, Vocabulary & Reading Comprehension.' }
];

const subjectsList = computed(() => {
  return subjects.value.length > 0 ? subjects.value : fallbackSubjects;
});

async function selectSubject(subject) {
  selectedSubject.value = subject;
  await fetchTasks(subject.id);
}

async function fetchTasks(subjectId) {
  loadingTasks.value = true;
  try {
    const url = subjectId ? `/student/tasks?subject_id=${subjectId}` : '/student/tasks';
    const res = await api.get(url);
    if (res.data.success) {
      tasks.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch subject tasks:', err);
  } finally {
    loadingTasks.value = false;
  }
}

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
  return '📚';
}

onMounted(async () => {
  try {
    const res = await api.get('/student/subjects');
    if (res.data.success && res.data.data.length > 0) {
      subjects.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch subjects:', err);
  } finally {
    loadingSubjects.value = false;
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

.subject-filter-banner {
  background: #e0e7ff;
  border: 1px solid #c7d2fe;
  padding: 10px 16px;
  border-radius: 14px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: #3730a3;
}

.clear-filter-btn {
  background: #ffffff;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 4px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 11px;
}

.subjects-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.subject-item-card {
  cursor: pointer;
}

.section-subtitle {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 20px 0 12px;
}
</style>
