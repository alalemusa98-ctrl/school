import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/auth/LoginView.vue';
import StudentDashboardView from '../views/student/StudentDashboardView.vue';
import HomeworksView from '../views/student/HomeworksView.vue';
import ExamsView from '../views/student/ExamsView.vue';
import ScheduleView from '../views/student/ScheduleView.vue';
import SubjectsView from '../views/student/SubjectsView.vue';
import TeacherDashboardView from '../views/teacher/TeacherDashboardView.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },

  // Student Routes
  { path: '/student', name: 'student-dashboard', component: StudentDashboardView, meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/homeworks', name: 'student-homeworks', component: HomeworksView, meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/exams', name: 'student-exams', component: ExamsView, meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/schedule', name: 'student-schedule', component: ScheduleView, meta: { requiresAuth: true, role: 'STUDENT' } },
  { path: '/student/subjects', name: 'student-subjects', component: SubjectsView, meta: { requiresAuth: true, role: 'STUDENT' } },

  // Teacher Routes
  { path: '/teacher', name: 'teacher-dashboard', component: TeacherDashboardView, meta: { requiresAuth: true, role: 'TEACHER' } },

  // Admin Routes
  { path: '/admin', name: 'admin-dashboard', component: AdminDashboardView, meta: { requiresAuth: true, role: 'ADMIN' } },

  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('school_token');
  const userStr = localStorage.getItem('school_user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return next('/login');
    }
    if (to.meta.role && user.role !== to.meta.role) {
      if (user.role === 'STUDENT') return next('/student');
      if (user.role === 'TEACHER') return next('/teacher');
      if (user.role === 'ADMIN') return next('/admin');
      return next('/login');
    }
  } else if (to.name === 'login' && token && user) {
    if (user.role === 'STUDENT') return next('/student');
    if (user.role === 'TEACHER') return next('/teacher');
    if (user.role === 'ADMIN') return next('/admin');
  }

  next();
});

export default router;
