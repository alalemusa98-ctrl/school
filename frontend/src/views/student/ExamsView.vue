<template>
  <StudentLayout pageTitle="📝 قائمة الامتحانات والتجميعات التحصيلية">
    <div v-if="loading" class="glass-box loading-box">جاري استرجاع قائمة الامتحانات... ⏳</div>
    <div v-else-if="exams.length === 0" class="glass-box empty-box">
      🎈 لا توجد امتحانات محددة حالياً لشعبتك!
    </div>
    <div v-else class="tasks-grid">
      <TaskCard v-for="task in exams" :key="task.id" :task="task" />
    </div>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
import TaskCard from '../../components/student/TaskCard.vue';
import api from '../../services/api';

const loading = ref(true);
const exams = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks?task_type=EXAM');
    if (res.data.success) {
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

.tasks-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
