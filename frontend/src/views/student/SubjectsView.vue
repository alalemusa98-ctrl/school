<template>
  <StudentLayout pageTitle="📖 المواد الدراسية المقررة لصفك">
    <div v-if="selectedSubject" class="subject-filter-banner">
      <span>عرض الواجبات المخصصة لمادة: <strong>{{ selectedSubject.name }}</strong></span>
      <button class="clear-filter-btn" @click="selectedSubject = null; fetchTasks(null);">
        ❌ إغلاق التصفية وعرض الكل
      </button>
    </div>

    <!-- Subjects Grid -->
    <div v-if="loadingSubjects" class="glass-box">جاري تحميل المواد... ⏳</div>
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
      <h3 class="section-subtitle">واجبات وامتحانات مادة {{ selectedSubject.name }}:</h3>

      <div v-if="loadingTasks" class="glass-box">جاري تحميل الواجبات... ⏳</div>
      <div v-else-if="tasks.length === 0" class="glass-box">
        🎉 لا توجد واجبات أو امتحانات سابقة مضافة لهذه المادة حالياً.
      </div>
      <div v-else class="tasks-grid">
        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </div>
    </div>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
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
.glass-box {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(12px);
  border: 3px solid #ffffff;
  padding: 40px;
  border-radius: 28px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.subject-filter-banner {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #93c5fd;
  padding: 12px 24px;
  border-radius: 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e3a8a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.clear-filter-btn {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  padding: 6px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  font-family: inherit;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.subject-tasks-section {
  margin-top: 32px;
}

.section-subtitle {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 16px;
}

.tasks-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
