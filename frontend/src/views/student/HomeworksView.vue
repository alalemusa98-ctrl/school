<template>
  <StudentLayout pageTitle="📚 الواجبات المدرسية المطلوب حلها">
    <div v-if="loading" class="glass-box loading-box">جاري استرجاع الواجبات المدرسية... ⏳</div>
    <div v-else-if="homeworks.length === 0" class="glass-box empty-box">
      🎉 رائع جداً! لا توجد واجبات منزلية متأخرة لشعبتك حالياً. أنت ممتاز!
    </div>
    <div v-else class="tasks-grid">
      <TaskCard v-for="task in homeworks" :key="task.id" :task="task" />
    </div>
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
import TaskCard from '../../components/student/TaskCard.vue';
import api from '../../services/api';

const loading = ref(true);
const homeworks = ref([]);

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks?task_type=HOMEWORK');
    if (res.data.success) {
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
