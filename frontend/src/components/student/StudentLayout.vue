<template>
  <div class="libyan-student-layout">
    <!-- Top Navbar -->
    <header class="top-navbar container">
      <div class="brand-logo" @click="$router.push('/student')">
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
      <!-- Background Floating Elements -->
      <div class="decor-elements">
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">☁️</div>
        <div class="star star-1">⭐</div>
        <div class="star star-2">✨</div>
        <div class="star star-3">🌟</div>
        <div class="palm-tree palm-left">🌴</div>
        <div class="palm-tree palm-right">🌴</div>
      </div>

      <!-- Page Top Header Bar -->
      <div class="subpage-header-card animate-fade-in" v-if="pageTitle">
        <button class="back-home-btn" @click="$router.push('/student')">
          👉 العودة للرئيسية
        </button>
        <h2 class="subpage-title">{{ pageTitle }}</h2>
      </div>

      <!-- Main Slot Content -->
      <div class="layout-body animate-fade-in">
        <slot></slot>
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
import { useRouter } from 'vue-router';
import MobileNav from '../common/MobileNav.vue';

defineProps({
  pageTitle: { type: String, default: '' }
});

const router = useRouter();

function handleLogout() {
  localStorage.removeItem('school_token');
  localStorage.removeItem('school_user');
  router.push('/login');
}
</script>

<style scoped>
.libyan-student-layout {
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

/* Navbar */
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
  cursor: pointer;
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

/* Canvas & Floating Decor */
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

/* Subpage Header Card */
.subpage-header-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 3px solid #ffffff;
  border-radius: 24px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 28px;
}

.back-home-btn {
  font-family: inherit;
  font-weight: 800;
  font-size: 0.95rem;
  background: #fef08a;
  color: #78350f;
  border: 2px solid #fde047;
  padding: 8px 18px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.back-home-btn:hover {
  transform: translateY(-2px);
  background: #fef9c3;
}

.subpage-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1e293b;
}

.layout-body {
  position: relative;
  z-index: 2;
}

/* Footer Banner */
.footer-scroll-banner {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  margin-top: 36px;
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
</style>
