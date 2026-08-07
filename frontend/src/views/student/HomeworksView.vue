<template>
  <div class="homeworks-page">
    <AppNavbar />

    <main class="container page-content">
      <div class="page-header">
        <BaseButton variant="outline" size="sm" @click="$router.push('/student')">
          👉 العودة للرئيسية
        </BaseButton>
        <h2>📚 الواجبات المدرسية المطلوب كتابتها وحلها</h2>
      </div>

      <div v-if="loading" class="loading-box">جاري استرجاع الواجبات المدرسية... ⏳</div>
      <div v-else-if="homeworks.length === 0" class="empty-box">
        🎉 رائع جداً! لا توجد واجبات منزلية متأخرة لشعبتك حالياً.
      </div>
      <div v-else class="tasks-grid">
        <TaskCard v-for="task in homeworks" :key="task.id" :task="task" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseButton from '../../components/common/BaseButton.vue';
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

.loading-box, .empty-box {
  background: #ffffff;
  padding: 40px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px dashed #cbd5e1;
}
</style>
