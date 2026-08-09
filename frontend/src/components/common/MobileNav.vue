<template>
  <nav class="mobile-nav-bar animate-fade-in">
    <div class="mobile-nav-container">
      <!-- 1. الرئيسية (Home) -->
      <button 
        class="nav-item-btn" 
        :class="{ active: currentRoute === '/student' }" 
        @click="$router.push('/student')"
      >
        <span class="nav-icon">🏠</span>
        <span class="nav-label">الرئيسية</span>
      </button>

      <!-- 2. الجدول الدراسي (Weekly Schedule) -->
      <button 
        class="nav-item-btn" 
        :class="{ active: currentRoute === '/student/schedule' }" 
        @click="$router.push('/student/schedule')"
      >
        <span class="nav-icon">🗓️</span>
        <span class="nav-label">الجدول الدراسي</span>
      </button>

      <!-- 3. زر الرجوع (Back Button) -->
      <button class="nav-item-btn back-btn" @click="handleBack">
        <span class="nav-icon">↩️</span>
        <span class="nav-label">رجوع</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const currentRoute = computed(() => route.path);

function handleBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/student');
  }
}
</script>

<style scoped>
/* Bottom Floating Mobile Navigation Bar */
.mobile-nav-bar {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%) !important;
  z-index: 999;
  width: 92%;
  max-width: 420px;
}

.mobile-nav-container {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  border: 3px solid #ffffff;
  border-radius: 28px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
}

.nav-item-btn {
  background: none;
  border: none;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 14px;
  border-radius: 18px;
  cursor: pointer;
  transition: all 0.25s ease;
  color: #475569;
}

.nav-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.nav-label {
  font-size: 0.8rem;
  font-weight: 800;
}

.nav-item-btn:hover {
  background: rgba(79, 70, 229, 0.08);
  transform: translateY(-2px);
}

.nav-item-btn.active {
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.back-btn {
  color: #b45309;
}

.back-btn:hover {
  background: #fef3c7;
}

/* Hide on desktop large screens if preferred, or keep styled */
@media (min-width: 1024px) {
  .mobile-nav-bar {
    display: none;
  }
}
</style>
