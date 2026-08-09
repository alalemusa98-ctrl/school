<template>
  <div class="libyan-student-dashboard">
    <!-- Top Decorative Navbar -->
    <header class="top-navbar container">
      <div class="brand-logo">
        <div class="logo-icon-wrapper">
          <svg class="open-book-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18C14 14 26 14 32 20C38 14 50 14 58 18V50C50 46 38 46 32 52C26 46 14 46 6 50V18Z" fill="#FFFFFF" stroke="#2C5282" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M32 20V52" stroke="#2C5282" stroke-width="3" stroke-linecap="round"/>
            <path d="M32 10L35 15H40L36 18L38 23L32 20L26 23L28 18L24 15H29L32 10Z" fill="#F6AD55"/>
          </svg>
        </div>
        <div class="logo-text-group">
          <span class="sub-title">المدرسة الليبية</span>
          <h1 class="main-title">نظام إدارة المدرسة الليبية</h1>
        </div>
      </div>

      <button class="logout-rocket-btn" @click="handleLogout">
        <span class="rocket-icon">🚀</span>
        <span class="logout-text">خروج</span>
        <span class="arrow-icon">➔</span>
      </button>
    </header>

    <!-- Main Decorative Canvas Container -->
    <main class="dashboard-canvas container">
      <!-- Background Floating Decorative Elements -->
      <div class="decor-elements">
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">☁️</div>
        <div class="star star-1">⭐</div>
        <div class="star star-2">✨</div>
        <div class="star star-3">🌟</div>
        <div class="palm-tree palm-left">🌴</div>
        <div class="palm-tree palm-right">🌴</div>
      </div>

      <!-- Center Welcome Banner Card with Characters -->
      <div class="welcome-center-card animate-fade-in">
        <!-- Right Character (Libyan Boy with Tarboosh) -->
        <div class="character-boy tarboosh-boy">
          <div class="boy-avatar-circle">
            <span class="tarboosh-emoji">👳‍♂️🏼</span>
            <span class="notes-emoji">🎵</span>
          </div>
        </div>

        <!-- Center Welcome Text Pill -->
        <div class="welcome-text-bubble">
          <h2 class="welcome-heading">
            أهلاً بك مجدداً، <span class="student-name">{{ studentName || 'تامر المصراتي' }}</span> 👋
          </h2>
          <div class="grade-section-pill">
            <span>{{ studentGrade || 'الصف الخامس' }}</span>
            <span class="divider">-</span>
            <span>الشعبة ({{ studentSection || '5أ' }})</span>
          </div>
        </div>

        <!-- Center Studying Boy Character -->
        <div class="character-boy studying-boy">
          <div class="studying-avatar">
            <span class="student-emoji">👦🏻</span>
            <div class="desk-surface">💻📖</div>
          </div>
        </div>
      </div>

      <!-- 2x2 Interactive Glossy Glassmorphic Cards Grid -->
      <div class="cards-grid">
        <!-- 1. الواجبات Card (Top Left) -->
        <div 
          class="glass-card homework-glass-card" 
          @click="$router.push('/student/homeworks')"
        >
          <div class="card-glass-shine"></div>
          
          <div class="card-illustration">
            <img src="/images/homeworks_card.jpg" alt="الواجبات" class="card-image-graphic" />
          </div>

          <div class="card-content">
            <h3 class="card-main-title">الواجبات</h3>
            <p class="card-sub-description">الواجبات الحالية المطلوب حلها</p>
            
            <div class="wooden-board-badge">
              <span class="badge-count">{{ newHomeworksCount }}</span>
              <span class="badge-text">واجبات جديدة</span>
            </div>
          </div>
        </div>

        <!-- 2. الامتحانات Card (Top Right) -->
        <div 
          class="glass-card exam-glass-card" 
          @click="$router.push('/student/exams')"
        >
          <div class="card-glass-shine"></div>

          <div class="card-illustration">
            <img src="/images/exams_card.jpg" alt="الامتحانات" class="card-image-graphic" />
          </div>

          <div class="card-content">
            <h3 class="card-main-title">الامتحانات</h3>
            <p class="card-sub-description">الامتحانات وتفاصيلها</p>

            <div class="ribbon-badge">
              <span class="ribbon-count">{{ newExamsCount }}</span>
              <span class="ribbon-text">امتحان قادم</span>
            </div>
          </div>
        </div>

        <!-- 3. المواد Card (Bottom Left) -->
        <div 
          class="glass-card subjects-glass-card" 
          @click="$router.push('/student/subjects')"
        >
          <div class="card-glass-shine"></div>

          <div class="card-illustration">
            <img src="/images/subjects_card.png" alt="المواد" class="card-image-graphic" />
          </div>

          <div class="card-content">
            <h3 class="card-main-title">المواد</h3>
            <p class="card-sub-description">المواد الدراسية ومحتواها</p>

            <div class="browse-wooden-btn">
              <span>تصفح كل المواد</span>
            </div>
          </div>
        </div>

        <!-- 4. الجدول الدراسي Card (Bottom Right) -->
        <div 
          class="glass-card schedule-glass-card" 
          @click="$router.push('/student/schedule')"
        >
          <div class="card-glass-shine"></div>

          <div class="card-illustration">
            <img src="/images/schedule_card.jpg" alt="الجدول الدراسي" class="card-image-graphic" />
          </div>

          <div class="card-content">
            <h3 class="card-main-title">الجدول الدراسي</h3>
            <p class="card-sub-description">جدول حصص الأسبوع لشعبتك</p>

            <div class="signpost-buttons-group">
              <div class="signpost-btn">عرض الجدول</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Scroll Banner -->
      <footer class="footer-scroll-banner">
        <div class="scroll-content">
          <span>© 2026 نظام المدرسة الليبية</span>
        </div>
      </footer>
    </main>

    <!-- Floating Mobile Navigation Menu -->
    <MobileNav />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import MobileNav from '../../components/common/MobileNav.vue';
import api from '../../services/api';

const router = useRouter();
const recentTasks = ref([]);

const userStr = localStorage.getItem('school_user');
const user = userStr ? JSON.parse(userStr) : {};

const studentName = computed(() => user.fullName || 'تامر المصراتي');
const studentGrade = computed(() => user.gradeName || 'الصف الخامس');
const studentSection = computed(() => user.sectionName || '5أ');

const newHomeworksCount = computed(() => {
  return recentTasks.value.filter(t => t.task_type === 'HOMEWORK').length || 3;
});

const newExamsCount = computed(() => {
  return recentTasks.value.filter(t => t.task_type === 'EXAM').length || 1;
});

function handleLogout() {
  localStorage.removeItem('school_token');
  localStorage.removeItem('school_user');
  router.push('/login');
}

onMounted(async () => {
  try {
    const res = await api.get('/student/tasks');
    if (res.data.success) {
      recentTasks.value = res.data.data;
    }
  } catch (err) {
    console.error('Failed to load student tasks:', err);
  }
});
</script>

<style scoped>
/* Main Page Container - Mint Teal Landscape */
.libyan-student-dashboard {
  min-height: 100vh;
  background: linear-gradient(180deg, #64d4c5 0%, #7ee6d9 45%, #b2f5ea 100%);
  font-family: 'Readex Pro', 'Tajawal', sans-serif;
  direction: rtl;
  padding-bottom: 40px;
  position: relative;
  overflow-x: hidden;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 1. Navbar Styling */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  padding-bottom: 16px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon-wrapper {
  width: 52px;
  height: 52px;
  background: #ffffff;
  border-radius: 16px;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.open-book-svg {
  width: 100%;
  height: 100%;
}

.logo-text-group {
  display: flex;
  flex-direction: column;
}

.logo-text-group .sub-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a4942;
}

.logo-text-group .main-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: #0d3832;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
}

.logout-rocket-btn {
  background: #ffffff;
  border: 2px solid #b2f5ea;
  border-radius: 24px;
  padding: 8px 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 800;
  font-size: 0.95rem;
  color: #2c5282;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
}

.logout-rocket-btn:hover {
  transform: translateY(-2px);
  background: #edfdfd;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

/* 2. Dashboard Canvas & Floating Elements */
.dashboard-canvas {
  position: relative;
  margin-top: 10px;
}

.decor-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.cloud {
  position: absolute;
  font-size: 2.5rem;
  opacity: 0.7;
}

.cloud-1 { top: 20px; left: 40px; }
.cloud-2 { top: 60px; right: 50px; }

.star {
  position: absolute;
  font-size: 1.5rem;
}

.star-1 { top: 10px; right: 280px; }
.star-2 { top: 110px; left: 180px; }
.star-3 { top: 30px; left: 50%; }

.palm-tree {
  position: absolute;
  font-size: 3.5rem;
  top: 40px;
}

.palm-left { left: 10px; }
.palm-right { right: 10px; }

/* 3. Welcome Center Card */
.welcome-center-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 3px solid #ffffff;
  border-radius: 28px;
  padding: 16px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 720px;
  margin: 0 auto 32px auto;
}

.welcome-text-bubble {
  text-align: center;
  flex: 1;
}

.welcome-heading {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1a365d;
  margin-bottom: 6px;
}

.student-name {
  color: #2b6cb0;
}

.grade-section-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fbd38d;
  color: #744210;
  font-weight: 800;
  font-size: 0.95rem;
  padding: 6px 18px;
  border-radius: 20px;
  border: 2px solid #f6ad55;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.character-boy {
  display: flex;
  align-items: center;
  justify-content: center;
}

.boy-avatar-circle {
  font-size: 2.8rem;
  background: #fff5f5;
  border: 3px solid #feb2b2;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.notes-emoji {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1rem;
}

.studying-avatar {
  font-size: 2.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.desk-surface {
  font-size: 1.1rem;
  margin-top: -10px;
}

/* 4. 2x2 Glassmorphic Cards Grid */
.cards-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.glass-card {
  position: relative;
  height: 240px;
  border-radius: 28px;
  padding: 24px;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 3px solid rgba(255, 255, 255, 0.8);
}

.glass-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-glass-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 45%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
}

/* Card 1 Theme: الواجبات (Golden Amber) */
.homework-glass-card {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
  border-color: #fcd34d;
}

/* Card 2 Theme: الامتحانات (Rose Pink Castle) */
.exam-glass-card {
  background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%);
  border-color: #fda4af;
}

/* Card 3 Theme: المواد (Purple Magic Carpet) */
.subjects-glass-card {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);
  border-color: #d8b4fe;
}

/* Card 4 Theme: الجدول الدراسي (Ice Cyan Clock) */
.schedule-glass-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #bae6fd 100%);
  border-color: #7dd3fc;
}

/* Illustrations inside Cards */
.card-illustration {
  width: 155px;
  height: 155px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  border: 3px solid rgba(255, 255, 255, 0.9);
  flex-shrink: 0;
}

.card-image-graphic {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 18px;
  transition: transform 0.4s ease;
}

.glass-card:hover .card-image-graphic {
  transform: scale(1.08);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
  flex: 1;
}

.card-main-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #1e293b;
  margin-bottom: 6px;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.card-sub-description {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 18px;
}

/* Badges & Buttons inside Cards */
.wooden-board-badge {
  background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
  color: #ffffff;
  border: 2px solid #78350f;
  border-radius: 12px;
  padding: 6px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(180, 83, 9, 0.3);
}

.badge-count {
  background: #fef08a;
  color: #78350f;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.ribbon-badge {
  background: linear-gradient(180deg, #f43f5e 0%, #be123c 100%);
  color: #ffffff;
  border: 2px solid #881337;
  border-radius: 20px;
  padding: 6px 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(190, 18, 60, 0.3);
}

.ribbon-count {
  background: #ffffff;
  color: #be123c;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.browse-wooden-btn {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  color: #ffffff;
  border: 2px solid #92400e;
  border-radius: 16px;
  padding: 8px 20px;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(217, 119, 6, 0.3);
}

.signpost-buttons-group {
  display: flex;
  gap: 8px;
}

.signpost-btn {
  background: linear-gradient(180deg, #eab308 0%, #ca8a04 100%);
  color: #422006;
  border: 2px solid #854d0e;
  border-radius: 14px;
  padding: 6px 16px;
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow: 0 4px 8px rgba(202, 138, 4, 0.25);
}

/* 5. Footer Scroll Banner */
.footer-scroll-banner {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.scroll-content {
  background: linear-gradient(180deg, #fef3c7 0%, #fde68a 100%);
  border: 3px solid #d97706;
  color: #78350f;
  padding: 8px 36px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Responsive Grid for Tablets & Phones */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .glass-card {
    height: auto;
    min-height: 180px;
  }

  .welcome-center-card {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
