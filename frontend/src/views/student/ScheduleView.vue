<template>
  <StudentLayout pageTitle="🗓️ الجدول الدراسي الأسبوعي لشعبتك">
    <div v-if="loading" class="glass-box loading-box">جاري استرجاع جدول الحصص... ⏳</div>
    <div v-else class="days-container">
      <div v-for="day in daysOfWeek" :key="day.id" class="day-group-glass">
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
  </StudentLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StudentLayout from '../../components/student/StudentLayout.vue';
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

.days-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.day-group-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 3px solid #ffffff;
  border-radius: 24px;
  padding: 20px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.day-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: #2b6cb0;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px stroke #bee3f8;
}

.no-classes {
  color: #64748b;
  font-size: 1rem;
  font-weight: 700;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
</style>
