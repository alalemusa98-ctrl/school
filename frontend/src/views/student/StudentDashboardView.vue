<template>
  <div class="student-dashboard">
    <AppNavbar />

    <main class="container page-content">
      <!-- Welcome Kid Banner Card -->
      <BaseCard class="welcome-banner animate-fade-in">
        <div class="banner-content">
          <h2>أهلاً بك يا بطل {{ studentName }} 🌟</h2>
          <p>صفك: <strong>{{ studentGrade }}</strong> — الشعبة: <strong>{{ studentSection }}</strong></p>
        </div>
        <div class="banner-avatar">🎉</div>
      </BaseCard>

      <h3 class="section-title">اختر ما تريد استكشافه اليوم:</h3>

      <!-- Navigation Cards Grid (No Tabs Architecture) -->
      <div class="nav-cards-grid">
        <BaseCard 
          :isClickable="true" 
          class="nav-card homework-card" 
          @click="$router.push('/student/homeworks')"
        >
          <div class="card-icon">📚</div>
          <div class="card-info">
            <h4>الواجبات المدرسية</h4>
            <p>متابعة واجباتك اليومية المطلوبة والحلول</p>
          </div>
          <div class="card-arrow">👈</div>
        </BaseCard>

        <BaseCard 
          :isClickable="true" 
          class="nav-card exam-card" 
          @click="$router.push('/student/exams')"
        >
          <div class="card-icon">📝</div>
          <div class="card-info">
            <h4>الامتحانات</h4>
            <p>مواعيد الامتحانات وأوراق الأسئلة والحلول</p>
          </div>
          <div class="card-arrow">👈</div>
        </BaseCard>

        <BaseCard 
          :isClickable="true" 
          class="nav-card schedule-card" 
          @click="$router.push('/student/schedule')"
        >
          <div class="card-icon">🗓️</div>
          <div class="card-info">
            <h4>الجدول الدراسي</h4>
            <p>جدول حصصك الأسبوعي مرتب حسب الأيام</p>
          </div>
          <div class="card-arrow">👈</div>
        </BaseCard>

        <BaseCard 
          :isClickable="true" 
          class="nav-card subject-card" 
          @click="$router.push('/student/subjects')"
        >
          <div class="card-icon">📖</div>
          <div class="card-info">
            <h4>المواد الدراسية</h4>
            <p>تصفح مواد الصف واستعراض واجبات كل مادة</p>
          </div>
          <div class="card-arrow">👈</div>
        </BaseCard>
      </div>

      <!-- Recent Tasks Preview -->
      <div class="recent-tasks-section">
        <div class="section-header">
          <h3>آخر الواجبات والامتحانات المضافة حديثاً:</h3>
        </div>

        <div v-if="loading" class="loading-state">جاري تحميل المهام... ⏳</div>
        <div v-else-if="recentTasks.length === 0" class="empty-state">
          🎈 لا توجد واجبات جديدة حالياً! أنت ممتاز وجميع واجباتك المدرسية مكتملة.
        </div>
        <div v-else class="tasks-list">
          <TaskCard v-for="task in recentTasks" :key="task.id" :task="task" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import TaskCard from '../../components/student/TaskCard.vue';
import api from '../../services/api';

const loading = ref(true);
const recentTasks = ref([]);

const userStr = localStorage.getItem('school_user');
const user = userStr ? JSON.parse(userStr) : {};

const studentName = computed(() => user.fullName || '');
const studentGrade = computed(() => user.gradeName || '');
const studentSection = computed(() => user.sectionName || '');

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks');
    if (res.data.success) {
      recentTasks.value = res.data.data.slice(0, 5); // Take top 5
    }
  } catch (err) {
    console.error('Failed to load recent tasks:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page-content {
  padding-top: 28px;
  padding-bottom: 40px;
}

.welcome-banner {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-content h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.banner-content p {
  font-size: 1.05rem;
  opacity: 0.9;
}

.banner-avatar {
  font-size: 3.5rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 20px;
}

.nav-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 16px;
  border-width: 2px;
}

.homework-card { border-color: #fcd34d; }
.homework-card:hover { background: #fffbeb; }

.exam-card { border-color: #fca5a5; }
.exam-card:hover { background: #fef2f2; }

.schedule-card { border-color: #93c5fd; }
.schedule-card:hover { background: #eff6ff; }

.subject-card { border-color: #6ee7b7; }
.subject-card:hover { background: #ecfdf5; }

.card-icon {
  font-size: 2.8rem;
}

.card-info h4 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 4px;
}

.card-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.card-arrow {
  margin-right: auto;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.recent-tasks-section {
  margin-top: 32px;
}

.section-header h3 {
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.loading-state, .empty-state {
  background: #ffffff;
  padding: 32px;
  border-radius: var(--radius-md);
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  border: 2px dashed #cbd5e1;
  color: #64748b;
}
</style>
