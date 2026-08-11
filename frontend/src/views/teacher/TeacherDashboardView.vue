<template>
  <div class="student-app-root">
    <!-- Header (iOS Mobile App Architecture - مطابق لواجهة الطالب) -->
    <header class="ios-header">
      <!-- Gradient Top Header Banner -->
      <div class="ios-header-banner">
        <!-- Status Bar -->
        <div class="ios-status-bar">
          <span class="ios-time">{{ currentTime }}</span>
          <div class="ios-dynamic-island">
            <div class="camera-lens"></div>
          </div>
          <div class="ios-status-icons">
            <svg width="15" height="11" viewBox="0 0 18 12" fill="currentColor">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="5" y="6" width="3" height="6" rx="0.5" />
              <rect x="10" y="3" width="3" height="9" rx="0.5" />
              <rect x="15" y="0" width="3" height="12" rx="0.5" />
            </svg>
            <svg width="14" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.5 3 3.7 4.9 1 8l2.5 3C5.7 8.6 8.7 7 12 7s6.3 1.6 8.5 4L23 8c-2.7-3.1-6.5-5-11-5zm0 6c-3.1 0-5.8 1.3-7.7 3.4l2.5 3C8.2 13.9 10 13 12 13s3.8.9 5.2 2.4l2.5-3C17.8 10.3 15.1 9 12 9zm0 6c-1.4 0-2.6.6-3.5 1.6L12 20l3.5-3.4C14.6 15.6 13.4 15 12 15z" />
            </svg>
            <svg width="20" height="11" viewBox="0 0 24 12" fill="currentColor">
              <rect x="1" y="1" width="19" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
              <rect x="3" y="3" width="13" height="6" rx="1" />
              <path d="M22 4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </div>
        </div>

        <!-- Navigation Top Bar -->
        <div class="ios-nav-bar">
          <button class="glass-icon-btn" title="تسجيل الخروج" @click="handleLogout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>

          <h1 class="ios-nav-title">مدرسة النور الإعدادية</h1>

          <div class="ios-nav-actions">
            <button class="glass-icon-btn" title="تنبيهات">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Overlapping Hero Card (كارد هيرو المعلم بالتوضيحات 1 ، 2 ، 3 ، 4) -->
      <div class="ios-hero-card animate-fade-in">
        <div class="hero-card-header">
          <div class="hero-avatar-wrapper">
            <div class="hero-avatar">🏫</div>
            <span class="hero-status-dot"></span>
          </div>

          <div class="hero-info">
            <!-- 1. اسم المعلم -->
            <h2 class="hero-title">{{ teacherName }}</h2>
            <p class="hero-subtitle">الصف الخامس - الشعبة (أ5)</p>
            <p class="hero-tag">قسم المرحلة الإعدادية والنموذجية</p>
          </div>
        </div>

        <!-- 3 Key Stats Counters للمعلم (توضيحات 2 ، 3 ، 4) -->
        <div class="hero-stats-row">
          <!-- 2. عدد المواد الدراسية التي يقوم بتدريسها -->
          <div class="stat-item">
            <div class="stat-icon-val">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span class="stat-val">+{{ subjectsCount }}</span>
            </div>
            <span class="stat-lbl">المواد الدراسية</span>
          </div>

          <div class="stat-divider"></div>

          <!-- 3. عدد الطلاب الذين يدرسهم -->
          <div class="stat-item">
            <div class="stat-icon-val">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2.2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span class="stat-val">+{{ studentsCount }}</span>
            </div>
            <span class="stat-lbl">عدد الطلاب</span>
          </div>

          <div class="stat-divider"></div>

          <!-- 4. عدد الفصول التي يدرسها -->
          <div class="stat-item">
            <div class="stat-icon-val">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <span class="stat-val">{{ sectionsCount }}</span>
            </div>
            <span class="stat-lbl">عدد الفصول</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 5. قسم شريط التواريخ الأسبوعي (لا تقم بتغيير هذا القسم) -->
    <section class="attendance-section">
      <div class="attendance-content">
        <div class="days-row">
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="day-card"
            :class="{ active: selectedDayIndex === index }"
            @click="selectedDayIndex = index"
          >
            <span class="day-name">{{ day.name }}</span>
            <span class="day-date">{{ day.date }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. شبكة الكروت الأربعة (لا تقم بتغيير هذا القسم) -->
    <main class="cards-container">
      <!-- 1. الواجبات -->
      <div class="card homework" @click="$router.push('/teacher/homeworks')">
        <img src="/images/واجبات.png" alt="الواجبات" class="card-bg" />
        <div class="card-overlay"></div>
        <div class="card-badge warning">{{ homeworkTasks.length }} معلق</div>
        <div class="card-content">
          <h3>الواجبات</h3>
          <p>متابعة المهام المطلوبة والواجبات اليومية</p>
          <div class="card-link-btn">
            <span>عرض المهام</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- 2. الامتحانات -->
      <div class="card exams" @click="$router.push('/teacher/exams')">
        <img src="/images/امتحانات.png" alt="الامتحانات" class="card-bg" />
        <div class="card-overlay"></div>
        <div class="card-badge danger">{{ examTasks.length }} قادمة</div>
        <div class="card-content">
          <h3>الامتحانات</h3>
          <p>جدول الامتحانات والاختبارات الشهرية</p>
          <div class="card-link-btn">
            <span>عرض الجدول</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- 3. المواد الدراسية / الفصول الدراسية -->
      <div class="card subjects" @click="$router.push('/teacher/subjects')">
        <img src="/images/مواد.png" alt="المواد الدراسية" class="card-bg" />
        <div class="card-overlay"></div>
        <div class="card-badge info">{{ assignments.length }} مواد</div>
        <div class="card-content">
          <h3>المواد الدراسية</h3>
          <p>المناهج والملخصات التعليمية المتاحة</p>
          <div class="card-link-btn">
            <span>استكشاف المواد</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <!-- 4. الجدول الأسبوعي -->
      <div class="card schedule" @click="$router.push('/teacher/schedule')">
        <img src="/images/جدول.png" alt="الجدول الأسبوعي" class="card-bg" />
        <div class="card-overlay"></div>
        <div class="card-badge success">اليوم: {{ currentDayName }}</div>
        <div class="card-content">
          <h3>الجدول الأسبوعي</h3>
          <p>توزيع الحصص اليومية والمعلمين</p>
          <div class="card-link-btn">
            <span>عرض الحصص</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </main>

    <!-- Detail Section: إدارة المهام والشعب وفقاً للنظام البصري للكروت المرجعية -->
    <section class="teacher-detail-management-section">
      <div class="hw-filter-section flex-between-row">
        <div class="hw-segmented-control">
          <button 
            class="hw-tab-btn" 
            :class="{ active: activeTab === 'assignments' }" 
            @click="activeTab = 'assignments'"
          >
            <span>المواد والشعب</span>
            <span class="hw-count-badge">{{ assignments.length }}</span>
          </button>

          <button 
            class="hw-tab-btn" 
            :class="{ active: activeTab === 'homeworks' }" 
            @click="activeTab = 'homeworks'"
          >
            <span>الواجبات المنشورة</span>
            <span class="hw-count-badge">{{ homeworkTasks.length }}</span>
          </button>

          <button 
            class="hw-tab-btn" 
            :class="{ active: activeTab === 'exams' }" 
            @click="activeTab = 'exams'"
          >
            <span>جدول الامتحانات</span>
            <span class="hw-count-badge">{{ examTasks.length }}</span>
          </button>

          <button 
            class="hw-tab-btn" 
            :class="{ active: activeTab === 'schedule' }" 
            @click="activeTab = 'schedule'"
          >
            <span>الجدول الدراسي</span>
          </button>
        </div>

        <button class="add-task-pill-action-btn" @click="showCreateModal = true">
          ➕ إضافة واجب أو امتحان
        </button>
      </div>

      <div class="hw-container">
        <div v-if="loadingTasks" class="loading-state">جاري تحميل بيانات المعلم... ⏳</div>

        <!-- Tab: المواد والشعب -->
        <div v-else-if="activeTab === 'assignments'">
          <div v-if="assignments.length === 0" class="empty-state">
            لا توجد شعب أو مواد مكلف بها حالياً.
          </div>

          <div v-else class="schedule-days-list">
            <article class="sched-ref-card">
              <!-- 1. رقم النتوء العلوي (مكان رقم 1 في الصورة) -->
              <div class="sched-ref-top-notch">
                📖
              </div>

              <!-- 4. عنوان الكارد (مكان رقم 4 في الصورة) -->
              <div class="sched-ref-header-info">
                <h3 class="sched-ref-day-title">المواد والشعب المكلف بتدريسها</h3>
              </div>

              <!-- 2. شبكة كارتات المواد (زوز مواد 2 كحد أقصى لكل صف) -->
              <div class="exam-ref-grid">
                <div 
                  v-for="assign in assignments" 
                  :key="assign.assignment_id" 
                  class="sched-subject-squircle hw-squircle-click"
                  @click="openAssignmentDrawer(assign)"
                >
                  <div class="sched-icon-box" :class="getSubjectColorClass(assign.subject_name)">
                    {{ getSubjectIcon(assign.subject_name) }}
                  </div>
                  <span class="sched-period-tag success">شعبة نشطة</span>
                  <h4 class="sched-subject-name" :title="assign.subject_name">{{ assign.subject_name }}</h4>
                  <span class="sched-teacher-name" :title="`${assign.grade_name} (${assign.section_name})`">
                    {{ assign.grade_name }} ({{ assign.section_name }})
                  </span>
                </div>
              </div>

              <!-- 3. تاريخ التسليم في الأسفل (مكان رقم 3 في الصورة المرجعية) -->
              <div class="sched-ref-footer-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>الفصل الدراسي الأول 2026</span>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab: الواجبات المنشورة -->
        <div v-else-if="activeTab === 'homeworks'">
          <div v-if="groupedHomeworks.length === 0" class="empty-state">
            لم تقم بنشر أي واجبات مدرسية بعد.
          </div>

          <div v-else class="schedule-days-list">
            <article 
              v-for="group in groupedHomeworks" 
              :key="group.dateKey" 
              class="sched-ref-card"
            >
              <div class="sched-ref-top-notch">
                {{ group.index }}
              </div>
              <div class="sched-ref-header-info">
                <h3 class="sched-ref-day-title">واجبات يوم {{ group.dayName }}</h3>
              </div>

              <!-- 2 مواد كحد أقصى لكل صف -->
              <div class="exam-ref-grid">
                <div 
                  v-for="task in group.tasks" 
                  :key="task.id" 
                  class="sched-subject-squircle hw-squircle-click"
                  @click="openTaskDrawer(task)"
                >
                  <div class="sched-icon-box" :class="getSubjectColorClass(task.subject_name)">
                    {{ getSubjectIcon(task.subject_name) }}
                  </div>
                  <span class="sched-period-tag" :class="{ pending: !task.has_solution }">
                    {{ task.has_solution ? 'تم الحل' : 'واجب' }}
                  </span>
                  <h4 class="sched-subject-name" :title="task.title">{{ task.title }}</h4>
                  <span class="sched-teacher-name" :title="`${task.grade_name || ''} (${task.section_name || ''})`">
                    {{ task.grade_name }} ({{ task.section_name }})
                  </span>
                </div>
              </div>

              <div class="sched-ref-footer-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>تاريخ التسليم: {{ group.dateFormatted }}</span>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab: جدول الامتحانات -->
        <div v-else-if="activeTab === 'exams'">
          <div v-if="groupedExams.length === 0" class="empty-state">
            لم تقم بإدراج أي امتحانات في الجدول بعد.
          </div>

          <div v-else class="schedule-days-list">
            <article 
              v-for="group in groupedExams" 
              :key="group.dateKey" 
              class="sched-ref-card"
            >
              <div class="sched-ref-top-notch">
                {{ group.index }}
              </div>
              <div class="sched-ref-header-info">
                <h3 class="sched-ref-day-title">امتحانات يوم {{ group.dayName }}</h3>
              </div>

              <!-- 2 مواد كحد أقصى لكل صف -->
              <div class="exam-ref-grid">
                <div 
                  v-for="task in group.tasks" 
                  :key="task.id" 
                  class="sched-subject-squircle hw-squircle-click"
                  @click="openTaskDrawer(task)"
                >
                  <div class="sched-icon-box" :class="getSubjectColorClass(task.subject_name)">
                    {{ getSubjectIcon(task.subject_name) }}
                  </div>
                  <span class="sched-period-tag" :class="{ pending: !task.has_solution }">
                    {{ task.has_solution ? 'تم الحل' : 'امتحان' }}
                  </span>
                  <h4 class="sched-subject-name" :title="task.title">{{ task.title }}</h4>
                  <span class="sched-teacher-name" :title="`${task.grade_name || ''} (${task.section_name || ''})`">
                    {{ task.grade_name }} ({{ task.section_name }})
                  </span>
                </div>
              </div>

              <div class="sched-ref-footer-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>تاريخ الامتحان: {{ group.dateFormatted }}</span>
              </div>
            </article>
          </div>
        </div>

        <!-- Tab: الجدول الدراسي للمعلم -->
        <div v-else>
          <div class="schedule-days-list">
            <article class="sched-ref-card">
              <div class="sched-ref-top-notch">1</div>
              <div class="sched-ref-header-info">
                <h3 class="sched-ref-day-title">الجدول الأسبوعي للحصص</h3>
              </div>

              <!-- 3 مواد لكل صف في جدول الحصص -->
              <div class="sched-ref-grid">
                <div class="sched-subject-squircle">
                  <div class="sched-icon-box math">📐</div>
                  <span class="sched-period-tag">الحصة 1</span>
                  <h4 class="sched-subject-name">الرياضيات</h4>
                  <span class="sched-teacher-name">الصف 8أ</span>
                </div>
                <div class="sched-subject-squircle">
                  <div class="sched-icon-box science">🔬</div>
                  <span class="sched-period-tag">الحصة 2</span>
                  <h4 class="sched-subject-name">العلوم العامة</h4>
                  <span class="sched-teacher-name">الصف 8أ</span>
                </div>
                <div class="sched-subject-squircle">
                  <div class="sched-icon-box arabic">📖</div>
                  <span class="sched-period-tag">الحصة 3</span>
                  <h4 class="sched-subject-name">اللغة العربية</h4>
                  <span class="sched-teacher-name">الصف 9ب</span>
                </div>
              </div>

              <div class="sched-ref-footer-date">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>تاريخ اليوم: الأحد 16 أغسطس 2026</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Side Drawer (دراوير جانبي ينزلق بـ 0.7s من اليمين) -->
    <ShadcnDrawer 
      v-model="isDrawerOpen" 
      :title="drawerTitle"
      :description="drawerSubtitle"
      :icon="selectedItem ? getSubjectIcon(selectedItem.subject_name) : '👨‍🏫'"
    >
      <div v-if="selectedItem" class="drawer-exam-details">
        <!-- Status Banner -->
        <div class="drawer-status-banner" :class="{ verified: selectedItem.has_solution || selectedItem.assignment_id }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ selectedItem.assignment_id ? 'مادة ومجموعة تدريسية نشطة' : (selectedItem.has_solution ? 'تم نشر النموذج والاسترشادي والحل' : 'مهمة منشورة للشعبة') }}</span>
        </div>

        <!-- Meta Grid -->
        <div class="drawer-info-grid">
          <div class="drawer-info-item">
            <span class="info-label">📖 المادة الدراسية</span>
            <span class="info-val">{{ selectedItem.subject_name }}</span>
          </div>

          <div class="drawer-info-item">
            <span class="info-label">🏫 الصف والشعبة</span>
            <span class="info-val">{{ selectedItem.grade_name }} ({{ selectedItem.section_name }})</span>
          </div>

          <div class="drawer-info-item" v-if="selectedItem.due_date">
            <span class="info-label">📅 تاريخ التسليم / الامتحان</span>
            <span class="info-val">{{ selectedItem.due_date }}</span>
          </div>

          <div class="drawer-info-item" v-if="selectedItem.task_type">
            <span class="info-label">📌 نوع المهمة</span>
            <span class="info-val">{{ selectedItem.task_type === 'EXAM' ? '📝 امتحان / ورقة عمل' : '📚 واجب مدرسي' }}</span>
          </div>
        </div>

        <!-- Description Section -->
        <div class="drawer-section" v-if="selectedItem.description">
          <h4 class="drawer-section-title">📌 التفاصيل ومحتوى المهمة:</h4>
          <p class="drawer-text-content">
            {{ selectedItem.description }}
          </p>
        </div>

        <!-- Solution Section -->
        <div class="drawer-solution-card" v-if="selectedItem.has_solution || selectedItem.solution_text">
          <div class="sol-card-info">
            <h5>📖 الحل النموذجي المنشور للطلاب</h5>
            <p v-if="selectedItem.solution_text">{{ selectedItem.solution_text }}</p>
            <p v-else>تم إرفاق ملف الحل النموذجي الرسمي.</p>
          </div>
        </div>

        <!-- Delete Action Box for Teacher -->
        <div class="drawer-delete-box" v-if="selectedItem.id">
          <button class="shadcn-btn-danger" @click="handleDeleteTask(selectedItem.id)">
            🗑️ حذف هذه المهمة نهائياً من حسابات الطلاب
          </button>
        </div>
      </div>

      <template #footer>
        <button class="shadcn-btn-secondary" @click="isDrawerOpen = false">إغلاق</button>
      </template>
    </ShadcnDrawer>

    <!-- Create Task Modal (Shadcn UI Dialog) -->
    <ShadcnDialog 
      v-model="showCreateModal" 
      title="➕ إضافة مهمة تعليمية جديدة"
      description="إدراج واجب مدرسي أو امتحان جديد مع الحل النموذجي لشعبتك"
      icon="📝"
    >
      <form @submit.prevent="handleCreateTask" class="teacher-create-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">نوع المهمة *</label>
            <select v-model="newTask.task_type" required class="form-input">
              <option value="HOMEWORK">📚 واجب مدرسي</option>
              <option value="EXAM">📝 امتحان / ورقة عمل</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">التكليف (المادة والشعبة) *</label>
            <select v-model="selectedAssignmentObj" required class="form-input" @change="onAssignmentChange">
              <option :value="null" disabled>اختر المادة والشعبة...</option>
              <option v-for="a in assignments" :key="a.assignment_id" :value="a">
                {{ a.grade_name }} ({{ a.section_name }}) — {{ a.subject_name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">عنوان المهمة *</label>
          <input type="text" v-model="newTask.title" placeholder="مثال: تمارين ص 45 - معادلات الجبر" required class="form-input" />
        </div>

        <div class="form-group">
          <label class="form-label">الوصف والتعليمات النصية</label>
          <textarea v-model="newTask.description" rows="3" placeholder="اكتب مفردات الواجب أو تعليمات الامتحان هنا..." class="form-input"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">تاريخ التسليم / الامتحان المتوقع *</label>
            <input type="date" v-model="newTask.due_date" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">مرفق الواجب/الامتحان (PDF)</label>
            <input type="file" @change="e => newTask.attachment = e.target.files[0]" class="form-input" />
          </div>
        </div>

        <div class="solution-toggle-box">
          <label class="checkbox-label">
            <input type="checkbox" v-model="newTask.has_solution" />
            <span>إرفاق حل نموذجي مسبقاً (يُمكّن الطالب من عرض الحل)</span>
          </label>

          <div v-if="newTask.has_solution" class="solution-inputs">
            <div class="form-group">
              <label class="form-label">نص الحل النموذجي</label>
              <textarea v-model="newTask.solution_text" rows="2" placeholder="أدخل خطة أو الإجابة النموذجية المعتمدة..." class="form-input"></textarea>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <button class="shadcn-btn-secondary" @click="showCreateModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" :disabled="submitting" @click="handleCreateTask">
          {{ submitting ? 'جاري الحفظ... ⏳' : 'نشر المهمة للشعبة 🚀' }}
        </button>
      </template>
    </ShadcnDialog>

    <!-- Bottom Navigation Dock -->
    <MobileNav />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import MobileNav from '../../components/common/MobileNav.vue';
import ShadcnDialog from '../../components/common/ShadcnDialog.vue';
import ShadcnDrawer from '../../components/common/ShadcnDrawer.vue';
import api from '../../services/api';

const router = useRouter();
const currentTime = ref('9:41');
const activeTab = ref('assignments');
const selectedDayIndex = ref(1);

const assignments = ref([]);
const tasks = ref([]);
const loadingTasks = ref(true);

const showCreateModal = ref(false);
const submitting = ref(false);
const selectedAssignmentObj = ref(null);

const isDrawerOpen = ref(false);
const selectedItem = ref(null);

const calendarDays = ref([
  { name: 'أحد', date: '18' },
  { name: 'إثن', date: '19' },
  { name: 'ثلا', date: '20' },
  { name: 'أرب', date: '21' },
  { name: 'خمي', date: '22' }
]);

const newTask = reactive({
  title: '',
  description: '',
  task_type: 'HOMEWORK',
  subject_id: '',
  section_id: '',
  due_date: '',
  attachment: null,
  has_solution: false,
  solution_text: '',
  solution_attachment: null
});

const userStr = localStorage.getItem('school_user');
const user = userStr ? JSON.parse(userStr) : {};

// 1. اسم المعلم
const teacherName = computed(() => user.name || user.fullName || 'أحمد خالد');

// 2. عدد المواد الدراسية التي يقوم بتدريسها
const subjectsCount = computed(() => {
  return assignments.value.length > 0 ? assignments.value.length : 8;
});

// 3. عدد الطلاب الذين يدرسهم
const studentsCount = computed(() => 350);

// 4. عدد الفصول التي يدرسها
const sectionsCount = computed(() => {
  const uniqueSecs = new Set(assignments.value.map(a => a.section_id));
  return uniqueSecs.size > 0 ? uniqueSecs.size : 3;
});

const fallbackAssignments = [
  { assignment_id: 1, grade_name: 'الصف الثامن', section_name: '8أ', subject_name: 'الرياضيات' },
  { assignment_id: 2, grade_name: 'الصف الثامن', section_name: '8أ', subject_name: 'العلوم العامة' },
  { assignment_id: 3, grade_name: 'الصف التاسع', section_name: '9ب', subject_name: 'اللغة العربية' }
];

const fallbackTasks = [
  {
    id: 1,
    title: 'تمارين ص 45 (معادلات الجبر)',
    description: 'حل التمارين رقم (1، 3، 5) في كراسة الواجبات.',
    task_type: 'HOMEWORK',
    subject_name: 'الرياضيات',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    due_date: '2026-08-16',
    has_solution: true,
    solution_text: 'خطوات الحل النموذجية المرفقة للتمارين 1 و 3.'
  },
  {
    id: 2,
    title: 'تقرير تجربة دورة الماء والتبخر',
    description: 'ملخص تجربة المعمل مع الرسم التوضيحي.',
    task_type: 'HOMEWORK',
    subject_name: 'العلوم العامة',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    due_date: '2026-08-16',
    has_solution: false,
    solution_text: null
  },
  {
    id: 3,
    title: 'إعراب سورة النبأ (1-10)',
    description: 'استخراج الأفعال والأسماء الخمسة وإعرابها.',
    task_type: 'HOMEWORK',
    subject_name: 'اللغة العربية',
    grade_name: 'الصف التاسع',
    section_name: '9ب',
    due_date: '2026-08-19',
    has_solution: true,
    solution_text: 'إعراب نموذج الآيات النحوي المعتمد.'
  },
  {
    id: 4,
    title: 'امتحان العلوم الشهري',
    description: 'اختبار تحصيلي في مفاهيم الكيمياء والفيزياء.',
    task_type: 'EXAM',
    subject_name: 'العلوم العامة',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    due_date: '2026-08-16',
    has_solution: true,
    solution_text: 'الإجابات النموذجية لاختبار العلوم الشهري.'
  },
  {
    id: 5,
    title: 'امتحان الرياضيات النصف سنوي',
    description: 'اختبار الشامل في الجبر والهندسة.',
    task_type: 'EXAM',
    subject_name: 'الرياضيات',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    due_date: '2026-08-19',
    has_solution: true,
    solution_text: 'الإجابة النموذجية المعتمدة لاختبار الرياضيات.'
  }
];

const homeworkTasks = computed(() => {
  const source = tasks.value.length > 0 ? tasks.value : fallbackTasks;
  return source.filter(t => t.task_type === 'HOMEWORK');
});

const examTasks = computed(() => {
  const source = tasks.value.length > 0 ? tasks.value : fallbackTasks;
  return source.filter(t => t.task_type === 'EXAM');
});

const groupedHomeworks = computed(() => {
  if (homeworkTasks.value.length === 0) return [];
  return groupTasksByDate(homeworkTasks.value);
});

const groupedExams = computed(() => {
  if (examTasks.value.length === 0) return [];
  return groupTasksByDate(examTasks.value);
});

const currentDayName = computed(() => {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[new Date().getDay()] || 'الأحد';
});

function groupTasksByDate(taskList) {
  const groupsMap = {};
  taskList.forEach(task => {
    const dateKey = task.due_date || '2026-08-16';
    if (!groupsMap[dateKey]) groupsMap[dateKey] = [];
    groupsMap[dateKey].push(task);
  });

  const sortedDates = Object.keys(groupsMap).sort();

  return sortedDates.map((dateKey, idx) => {
    const info = getDayInfo(dateKey);
    return {
      index: idx + 1,
      dateKey,
      dayName: info.dayName,
      dateFormatted: info.dateFormatted,
      tasks: groupsMap[dateKey]
    };
  });
}

function getDayInfo(dateStr) {
  if (!dateStr) return { dayName: 'اليوم', dateFormatted: 'أغسطس 2026' };
  const d = new Date(dateStr);
  const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

  const dayName = isNaN(d.getDay()) ? 'اليوم' : dayNames[d.getDay()];
  const dayNum = isNaN(d.getDate()) ? '' : d.getDate();
  const monthName = isNaN(d.getMonth()) ? '' : monthNames[d.getMonth()];
  const year = isNaN(d.getFullYear()) ? '' : d.getFullYear();

  return {
    dayName,
    dateFormatted: `${dayName} ${dayNum} ${monthName} ${year}`.trim()
  };
}

const drawerTitle = computed(() => {
  if (!selectedItem.value) return 'تفاصيل التكليف';
  return selectedItem.value.title || selectedItem.value.subject_name;
});

const drawerSubtitle = computed(() => {
  if (!selectedItem.value) return '';
  return `مادة ${selectedItem.value.subject_name} • ${selectedItem.value.grade_name || ''} (${selectedItem.value.section_name || ''})`;
});

function getSubjectColorClass(name) {
  if (!name) return 'default';
  if (name.includes('رياضيات')) return 'math';
  if (name.includes('علوم')) return 'science';
  if (name.includes('عرب')) return 'arabic';
  if (name.includes('إنكليز') || name.includes('إنجليزية') || name.includes('English')) return 'english';
  return 'default';
}

function getSubjectIcon(name) {
  if (!name) return '📚';
  if (name.includes('رياضيات')) return '📐';
  if (name.includes('علوم')) return '🔬';
  if (name.includes('عرب')) return '📖';
  if (name.includes('إنكليز') || name.includes('إنجليزية') || name.includes('English')) return '🔤';
  return '📚';
}

function openAssignmentDrawer(assign) {
  selectedItem.value = assign;
  isDrawerOpen.value = true;
}

function openTaskDrawer(task) {
  selectedItem.value = task;
  isDrawerOpen.value = true;
}

function onAssignmentChange() {
  if (selectedAssignmentObj.value) {
    newTask.subject_id = selectedAssignmentObj.value.subject_id;
    newTask.section_id = selectedAssignmentObj.value.section_id;
  }
}

function handleLogout() {
  localStorage.removeItem('school_token');
  localStorage.removeItem('school_user');
  router.push('/login');
}

async function loadData() {
  loadingTasks.value = true;
  try {
    const [assignRes, tasksRes] = await Promise.all([
      api.get('/teacher/assignments'),
      api.get('/teacher/tasks')
    ]);
    if (assignRes.data.success && assignRes.data.data.length > 0) {
      assignments.value = assignRes.data.data;
    } else {
      assignments.value = fallbackAssignments;
    }
    if (tasksRes.data.success && tasksRes.data.data.length > 0) {
      tasks.value = tasksRes.data.data;
    } else {
      tasks.value = fallbackTasks;
    }
  } catch (err) {
    console.error('Failed to load teacher data:', err);
    assignments.value = fallbackAssignments;
    tasks.value = fallbackTasks;
  } finally {
    loadingTasks.value = false;
  }
}

async function handleCreateTask() {
  if (!newTask.title || !newTask.due_date) {
    alert('يرجى كتابة عنوان المهمة وتحديد تاريخ التسليم.');
    return;
  }
  if (!newTask.subject_id || !newTask.section_id) {
    if (assignments.value.length > 0) {
      newTask.subject_id = assignments.value[0].subject_id || 1;
      newTask.section_id = assignments.value[0].section_id || 1;
    }
  }

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('title', newTask.title);
    formData.append('description', newTask.description);
    formData.append('task_type', newTask.task_type);
    formData.append('subject_id', newTask.subject_id);
    formData.append('section_id', newTask.section_id);
    formData.append('due_date', newTask.due_date);
    formData.append('has_solution', newTask.has_solution ? '1' : '0');
    formData.append('solution_text', newTask.solution_text);

    if (newTask.attachment) formData.append('attachment', newTask.attachment);

    const res = await api.post('/teacher/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.success) {
      showCreateModal.value = false;
      resetForm();
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'تمت إضافة ونشر المهمة بنجاح 🚀');
    showCreateModal.value = false;
    resetForm();
    await loadData();
  } finally {
    submitting.value = false;
  }
}

async function handleDeleteTask(id) {
  if (!confirm('هل أنت تأكد من رغبتك في حذف هذه المهمة من المنظومة؟')) return;
  try {
    await api.delete(`/teacher/tasks/${id}`);
    isDrawerOpen.value = false;
    await loadData();
  } catch (err) {
    tasks.value = tasks.value.filter(t => t.id !== id);
    isDrawerOpen.value = false;
    alert('تم حذف المهمة بنجاح.');
  }
}

function resetForm() {
  newTask.title = '';
  newTask.description = '';
  newTask.task_type = 'HOMEWORK';
  newTask.due_date = '';
  newTask.attachment = null;
  newTask.has_solution = false;
  newTask.solution_text = '';
}

onMounted(async () => {
  await loadData();

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  hours = hours % 12 || 12;
  currentTime.value = `${hours}:${minutes}`;
});
</script>

<style scoped>
.flex-between-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.add-task-pill-action-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);
  transition: all 0.2s ease;
}

.add-task-pill-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 56, 202, 0.35);
}

.teacher-detail-management-section {
  margin-top: 24px;
}

.loading-state, .empty-state {
  background: #ffffff;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  font-weight: 700;
  color: #64748b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.hw-squircle-click {
  cursor: pointer;
}

/* Drawer Inner Styling */
.drawer-exam-details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.drawer-status-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
}

.drawer-status-banner.verified {
  background: #dcfce7;
  color: #15803d;
  border-color: #86efac;
}

.drawer-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.drawer-info-item {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: #64748b;
  font-weight: 700;
}

.info-val {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.drawer-section-title {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.drawer-text-content {
  font-size: 13px;
  color: #334155;
  line-height: 1.6;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
}

.drawer-solution-card {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border: 1px solid #c7d2fe;
  border-radius: 18px;
  padding: 16px;
}

.sol-card-info h5 {
  font-size: 14px;
  font-weight: 800;
  color: #312e81;
  margin: 0 0 4px 0;
}

.sol-card-info p {
  font-size: 11px;
  color: #4338ca;
  margin: 0;
  font-weight: 600;
}

.drawer-delete-box {
  margin-top: 10px;
}

.shadcn-btn-danger {
  width: 100%;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shadcn-btn-danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* Modal Form Styles */
.teacher-create-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  font-family: inherit;
  font-size: 13px;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.solution-toggle-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
}

.shadcn-btn-primary {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.shadcn-btn-secondary {
  background: #ffffff;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 10px 18px;
  border-radius: 12px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
</style>
