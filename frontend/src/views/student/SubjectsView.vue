<template>
  <div class="subjects-page">
    <AppNavbar />

    <main class="container page-content">
      <div class="page-header">
        <BaseButton variant="outline" size="sm" @click="$router.push('/student')">
          👉 العودة للرئيسية
        </BaseButton>
        <h2>📖 المواد الدراسية المقررة لصفك</h2>
      </div>

      <div v-if="selectedSubject" class="subject-filter-banner">
        <span>عرض الواجبات المخصصة لمادة: <strong>{{ selectedSubject.name }}</strong></span>
        <BaseButton variant="ghost" size="sm" @click="selectedSubject = null; fetchTasks(null);">
          ❌ إغلاق التصفية وعرض الكل
        </BaseButton>
      </div>

      <!-- Subjects Grid -->
      <div v-if="loadingSubjects" class="loading-box">جاري تحميل المواد... ⏳</div>
      <div v-else class="subjects-grid">
        <SubjectCard 
          v-for="sub in subjects" 
          :key="sub.id" 
          :subject="sub" 
          @click="selectSubject(sub)"
        />
      </div>

      <!-- Filtered Tasks Result -->
      <div class="subject-tasks-section" v-if="selectedSubject">
        <h3 class="section-title">واجبات وامتحانات مادة {{ selectedSubject.name }}:</h3>

        <div v-if="loadingTasks" class="loading-box">جاري تحميل الواجبات... ⏳</div>
        <div v-else-if="tasks.length === 0" class="empty-box">
          🎉 لا توجد واجبات أو امتحانات سابقة مضافة لهذه المادة حالياً.
        </div>
        <div v-else class="tasks-grid">
          <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import SubjectCard from '../../components/student/SubjectCard.vue';
import TaskCard from '../../components/student/TaskCard.vue';
import api from '../../services/api';

const loadingSubjects = ref(true);
const loadingTasks = ref(false);

const subjects = ref([]);
const tasks = ref([]);
const selectedSubject = ref(null);

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

onMounted(async () => {
  try {
    const res = await api.get('/student/subjects');
    if (res.data.success) {
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
.page-content {
  padding-top: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.page-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
}

.subject-filter-banner {
  background: #eef2ff;
  border: 2px solid var(--primary-light);
  padding: 12px 20px;
  border-radius: var(--radius-md);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.05rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.loading-box, .empty-box {
  background: #ffffff;
  padding: 40px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px dashed #cbd5e1;
}

.subject-tasks-section {
  margin-top: 32px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 16px;
}
</style>
