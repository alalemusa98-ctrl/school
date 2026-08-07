<template>
  <div class="schedule-page">
    <AppNavbar />

    <main class="container page-content">
      <div class="page-header">
        <BaseButton variant="outline" size="sm" @click="$router.push('/student')">
          👉 العودة للرئيسية
        </BaseButton>
        <h2>🗓️ الجدول الدراسي الأسبوعي لشعبتك</h2>
      </div>

      <div v-if="loading" class="loading-box">جاري استرجاع جدول الحصص... ⏳</div>
      <div v-else class="days-container">
        <div v-for="day in daysOfWeek" :key="day.id" class="day-group">
          <h3 class="day-title">📅 {{ day.name }}</h3>
          
          <div v-if="getSlotsForDay(day.id).length === 0" class="no-classes">
            لا توجد حصص محددة هذا اليوم ☀️
          </div>
          <div v-else class="slots-grid">
            <ScheduleCard 
              v-for="slot in getSlotsForDay(day.id)" 
              :key="slot.id" 
              :slot="slot" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import ScheduleCard from '../../components/student/ScheduleCard.vue';
import api from '../../services/api';

const loading = ref(true);
const scheduleSlots = ref([]);

const daysOfWeek = [
  { id: 1, name: 'الأحد' },
  { id: 2, name: 'الإثنين' },
  { id: 3, name: 'الثلاثاء' },
  { id: 4, name: 'الأربعاء' },
  { id: 5, name: 'الخميس' }
];

function getSlotsForDay(dayId) {
  return scheduleSlots.value.filter(s => s.day_of_week === dayId);
}

onMounted(async () => {
  try {
    const res = await api.get('/student/schedule');
    if (res.data.success) {
      scheduleSlots.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch schedule:', err);
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

.loading-box {
  background: #ffffff;
  padding: 40px;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px dashed #cbd5e1;
}

.days-container {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.day-group {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--border-light);
}

.day-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e7ff;
}

.no-classes {
  color: var(--text-muted);
  font-size: 0.95rem;
  font-weight: 600;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
</style>
