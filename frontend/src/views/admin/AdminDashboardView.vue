<template>
  <div class="desktop-admin-root">
    <!-- Desktop Top Executive Header Navigation -->
    <header class="desktop-admin-header">
      <div class="header-brand">
        <div class="brand-badge-icon">⚙️</div>
        <div class="brand-text-group">
          <h1 class="brand-title">منظومة إدارة المدرسة</h1>
          <span class="brand-subtitle">لوحة التحكم الإدارية الشاملة</span>
        </div>
      </div>

      <!-- Center Desktop Navigation Pill Switcher -->
      <nav class="desktop-nav-pills">
        <button 
          class="desktop-pill-btn" 
          :class="{ active: activeModule === 'classrooms' || activeModule === 'structure' || activeModule === 'section-details' }"
          @click="activeModule = 'classrooms'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span>الفصول الدراسية ({{ grades.length }})</span>
        </button>

        <button 
          class="desktop-pill-btn" 
          :class="{ active: activeModule === 'students' }"
          @click="activeModule = 'students'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>الطالب ({{ students.length }})</span>
        </button>

        <button 
          class="desktop-pill-btn" 
          :class="{ active: activeModule === 'teachers' }"
          @click="activeModule = 'teachers'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          <span>المعلم ({{ teachers.length }})</span>
        </button>

        <button 
          class="desktop-pill-btn" 
          :class="{ active: activeModule === 'schedule' }"
          @click="activeModule = 'schedule'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
          <span>الجدول الدراسي</span>
        </button>

        <button 
          class="desktop-pill-btn" 
          :class="{ active: activeModule === 'analytics' }"
          @click="activeModule = 'analytics'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          <span>الإحصائيات اليومية 📊</span>
        </button>
      </nav>

      <!-- Desktop Right Controls: Search & User Profile -->
      <div class="header-controls">
        <div class="desktop-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="بحث سريع عن طالب، معلم، أو مادة..." class="search-input" />
        </div>

        <div class="admin-user-profile">
          <div class="avatar-box">👨‍💼</div>
          <div class="user-meta">
            <span class="user-name">مدير المنظومة</span>
            <span class="user-role">المدير العام</span>
          </div>
          <button class="logout-btn" title="تسجيل الخروج" @click="handleLogout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Desktop Main Layout Container -->
    <main class="desktop-main-wrapper">
      <div v-if="loading" class="desktop-loading-box">
        ⚡ جاري الاتصال بقاعدة البيانات واسترجاع السجلات الحية...
      </div>

      <template v-else>
        <!-- 1. Top KPI Summary Cards Row (شريط إحصائيات عريض ومريح للشاشات الكبيرة) -->
        <section class="desktop-kpi-grid">
          <!-- Card 1 -->
          <div class="kpi-desktop-card purple">
            <div class="kpi-icon-circle">🎓</div>
            <div class="kpi-body">
              <span class="kpi-label-text">إجمالي الطلاب المسجلين</span>
              <div class="kpi-value-row">
                <span class="kpi-big-num">{{ stats.totalStudents || 0 }}</span>
                <span class="badge-status success">96% حضور اليوم</span>
              </div>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="kpi-desktop-card indigo">
            <div class="kpi-icon-circle">👨‍🏫</div>
            <div class="kpi-body">
              <span class="kpi-label-text">كادر التدريس والمعلمين</span>
              <div class="kpi-value-row">
                <span class="kpi-big-num">{{ stats.totalTeachers || 0 }}</span>
                <span class="badge-status info">التكليفات مكتملة</span>
              </div>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="kpi-desktop-card emerald">
            <div class="kpi-icon-circle">🏫</div>
            <div class="kpi-body">
              <span class="kpi-label-text">الشعب والقاعات الدراسية</span>
              <div class="kpi-value-row">
                <span class="kpi-big-num">{{ stats.totalSections || 0 }}</span>
                <span class="badge-status neutral">المراحل 1 - 9</span>
              </div>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="kpi-desktop-card amber">
            <div class="kpi-icon-circle">📝</div>
            <div class="kpi-body">
              <span class="kpi-label-text">المهام والامتحانات النشطة</span>
              <div class="kpi-value-row">
                <span class="kpi-big-num">{{ stats.totalTasks || 0 }}</span>
                <span class="badge-status warning">هذا الأسبوع</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Two-Column Desktop Grid Architecture (2fr | 1fr) -->
        <div class="desktop-content-grid">
          <!-- LEFT MAIN CONTENT AREA (2fr) -->
          <div class="desktop-content-left">

            <!-- MODULE 1: الفصول الدراسية (Classrooms) -->
            <div v-if="activeModule === 'classrooms' || activeModule === 'structure'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">🏫 الهيكل التعليمي والفصول الدراسية</h3>
                    <p class="card-box-sub">عرض وإدارة الصفوف الدراسية 1-9، الشعب والقاعات، والمواد التعليمية</p>
                  </div>
                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="showAddSubjectModal = true">
                      📖 إضافة مادة
                    </button>
                    <button class="desktop-secondary-btn" @click="showAddSectionModal = true">
                      🏢 إضافة شعبة
                    </button>
                    <button class="desktop-primary-btn" @click="activeModule = 'creation'">
                      ➕ إضافة صف دراسي
                    </button>
                  </div>
                </div>

                <table class="desktop-table structure-master-table">
                  <thead>
                    <tr>
                      <th style="width: 240px;">الصف الدراسي (اضغط للتفاصيل)</th>
                      <th>🏫 الشعب والقاعات الدراسية (اضغط للتفاصيل والجدول)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="g in grades" :key="g.id">
                      <!-- 1. الصف الدراسي -->
                      <td class="grade-name-cell clickable-student-row" @click="openGradeDetail(g)" title="اضغط لعرض كافة بيانات وإحصائيات هذا الصف الدراسي">
                        <div class="grade-badge-flex">
                          <span class="grade-level-pill">{{ g.level }}</span>
                          <strong class="grade-title-text clickable-name">🏫 {{ g.name }}</strong>
                        </div>
                      </td>

                      <!-- 2. الشعب الدراسية -->
                      <td>
                        <div class="table-items-flex">
                          <span 
                            v-for="sec in g.sections" 
                            :key="sec.id" 
                            class="sec-pill-tag clickable-sec-pill"
                            @click="openSectionDetailModal(sec, g)"
                            title="اضغط لعرض جدول وتفاصيل الشعبة"
                          >
                            🏫 الشعبة {{ sec.name }}
                          </span>
                          <span v-if="!g.sections || g.sections.length === 0" class="empty-pill-muted">لا توجد شعب منشأة</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="grades.length === 0">
                      <td colspan="2" class="empty-table-msg">لا توجد صفوف دراسية منشأة حالياً.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- MODULE 8: GRADE DETAILS FULL PAGE VIEW -->
            <div v-else-if="activeModule === 'grade-details' && selectedGrade" class="tab-pane-content">
              <div class="desktop-card-box student-profile-card">
                <!-- Top Header with Back Button -->
                <div class="card-box-header flex-between">
                  <div class="flex-actions-gap">
                    <button class="back-to-structure-btn" @click="activeModule = 'classrooms'">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span>العودة لصفحة الفصول الدراسية</span>
                    </button>
                    <div class="sec-title-meta">
                      <h3 class="card-box-title">🏫 بيانات وتفاصيل: {{ selectedGrade.name }}</h3>
                      <span class="card-box-sub">المستوى الدراسي: {{ selectedGrade.level }} • إجمالي {{ gradeSections.length }} شعب • {{ gradeSubjects.length }} مواد • {{ gradeStudents.length }} طلاب</span>
                    </div>
                  </div>

                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="openAddSubjectModal(selectedGrade)">
                      📖 إضافة مادة
                    </button>
                    <button class="desktop-primary-btn" @click="openAddSectionModal(selectedGrade)">
                      🏢 إضافة شعبة
                    </button>
                  </div>
                </div>

                <!-- Hero Banner -->
                <div class="student-profile-body">
                  <div class="profile-hero-banner">
                    <div class="profile-avatar-big">🏫</div>
                    <div class="profile-hero-info">
                      <h2 class="profile-student-name">{{ selectedGrade.name }}</h2>
                      <div class="profile-badges-row">
                        <span class="profile-badge purple">المستوى {{ selectedGrade.level }}</span>
                        <span class="profile-badge indigo">🏢 {{ gradeSections.length }} شعب دراسية</span>
                        <span class="profile-badge emerald">📖 {{ gradeSubjects.length }} مواد مقررة</span>
                        <span class="profile-badge neutral">🎓 {{ gradeStudents.length }} طالب مقيد</span>
                      </div>
                    </div>
                  </div>

                  <div class="profile-info-grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                    <!-- Card 1: Sections & Classes -->
                    <div class="info-card-box">
                      <h4 class="info-card-title flex-between">
                        <span>🏢 الشعب والقاعات الدراسية المنشأة</span>
                        <button class="desktop-secondary-btn small-btn" @click="openAddSectionModal(selectedGrade)">+ إضافة شعبة</button>
                      </h4>
                      <div class="table-items-flex" style="padding: 10px 0;">
                        <span 
                          v-for="sec in gradeSections" 
                          :key="sec.id" 
                          class="sec-pill-tag clickable-sec-pill"
                          @click="openSectionDetailModal(sec, selectedGrade)"
                          title="اضغط لعرض جدول وتفاصيل الشعبة"
                          style="padding: 8px 14px; font-size: 13px;"
                        >
                          🏫 الشعبة {{ sec.name }}
                        </span>
                        <span v-if="gradeSections.length === 0" class="empty-pill-muted">لا توجد شعب منشأة لـ {{ selectedGrade.name }}</span>
                      </div>
                    </div>

                    <!-- Card 2: Subjects -->
                    <div class="info-card-box">
                      <h4 class="info-card-title flex-between">
                        <span>📖 المواد الدراسية المقررة</span>
                        <button class="desktop-secondary-btn small-btn" @click="openAddSubjectModal(selectedGrade)">+ إضافة مادة</button>
                      </h4>
                      <div class="info-details-list">
                        <table class="desktop-table" v-if="gradeSubjects.length > 0">
                          <thead>
                            <tr>
                              <th>اسم المادة</th>
                              <th>إجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="sub in gradeSubjects" :key="sub.id">
                              <td><strong class="clickable-name">📖 {{ sub.name }}</strong></td>
                              <td>
                                <button class="table-btn-danger" @click="handleDeleteSubject(sub.id)">حذف المادة</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div v-else class="empty-table-msg" style="padding: 12px 0;">
                          لا توجد مواد دراسية مضافة لهذا الصف بعد.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Enrolled Students Table -->
                  <div class="info-card-box" style="margin-top: 20px;">
                    <h4 class="info-card-title flex-between">
                      <span>🎓 سجل الطلاب المقيدين بـ {{ selectedGrade.name }} (إجمالي {{ gradeStudents.length }})</span>
                      <button class="desktop-primary-btn small-btn" @click="showAddStudentModal = true">+ إضافة طالب</button>
                    </h4>
                    <table class="desktop-table">
                      <thead>
                        <tr>
                          <th>رقم الجلوس</th>
                          <th>كود الطالب</th>
                          <th>اسم الطالب</th>
                          <th>الشعبة</th>
                          <th>إجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr 
                          v-for="st in gradeStudents" 
                          :key="st.id"
                          class="clickable-student-row"
                          @click="openStudentDetail(st)"
                        >
                          <td><strong>{{ st.roll_number }}</strong></td>
                          <td><code>{{ st.student_code }}</code></td>
                          <td><span class="clickable-name">🎓 {{ st.full_name }}</span></td>
                          <td><span class="sec-pill-tag section">{{ st.section_name }}</span></td>
                          <td @click.stop>
                            <div class="table-actions-inline">
                              <button class="table-btn-secondary" @click="openTransferStudentModal(st)">🔄 نقل</button>
                              <button class="table-btn-secondary" @click="openEditStudentModal(st)">✏️ تعديل</button>
                              <button class="table-btn-danger" @click="handleDeleteStudent(st.id)">حذف</button>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="gradeStudents.length === 0">
                          <td colspan="5" class="empty-table-msg">لا يوجد طلاب مقيدون بـ {{ selectedGrade.name }} حالياً.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>

            <!-- MODULE 2: الطالب (Student Management) -->
            <div v-else-if="activeModule === 'students'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">🎓 إدارة سجلات وحسابات الطلاب</h3>
                    <p class="card-box-sub">انقر على أي طالب لمشاهدة ملفه الكامل أو تنفيذ إجراءات النقل والتعديل</p>
                  </div>
                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="openTransferStudentModal(null)">
                      🔄 نقل طالب
                    </button>
                    <button class="desktop-primary-btn" @click="showAddStudentModal = true">
                      ➕ إضافة طالب جديد
                    </button>
                  </div>
                </div>

                <!-- Filters & Search Bar for Students -->
                <div class="students-filter-row" style="display: flex; gap: 12px; margin-bottom: 16px;">
                  <div class="search-box-flex" style="flex: 1;">
                    <input 
                      type="text" 
                      v-model="studentSearchQuery" 
                      placeholder="🔍 بحث باسم الطالب، كود الطالب، أو رقم الجلوس..." 
                      class="form-input"
                    />
                  </div>
                  <select v-model="studentGradeFilter" class="form-input" style="width: 180px;">
                    <option value="">جميع الصفوف</option>
                    <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                  </select>
                  <select v-model="studentSectionFilter" class="form-input" style="width: 180px;">
                    <option value="">جميع الشعب</option>
                    <template v-for="g in grades" :key="g.id">
                      <option v-for="sec in g.sections" :key="sec.id" :value="sec.id">
                        {{ g.name }} - {{ sec.name }}
                      </option>
                    </template>
                  </select>
                </div>

                <table class="desktop-table">
                  <thead>
                    <tr>
                      <th>رقم الجلوس</th>
                      <th>كود الطالب</th>
                      <th>الاسم الكامل للطالب</th>
                      <th>الصف الدراسي</th>
                      <th>الشعبة</th>
                      <th>إجراءات الإدارة</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="st in filteredStudents" 
                      :key="st.id"
                      class="clickable-student-row"
                      @click="openStudentDetail(st)"
                      title="اضغط لعرض الملف الشخصي الكامل للطالب"
                    >
                      <td><strong>{{ st.roll_number }}</strong></td>
                      <td><code>{{ st.student_code }}</code></td>
                      <td class="student-name-cell flex-align-gap">
                        <span class="clickable-name">🎓 {{ st.full_name }}</span>
                      </td>
                      <td><span class="sec-pill-tag grade">{{ st.grade_name }}</span></td>
                      <td><span class="sec-pill-tag section">{{ st.section_name }}</span></td>
                      <td @click.stop>
                        <div class="table-actions-inline">
                          <button class="table-btn-secondary" @click="openTransferStudentModal(st)" title="نقل الطالب لصف/شعبة أخرى">🔄 نقل</button>
                          <button class="table-btn-secondary" @click="openEditStudentModal(st)" title="تعديل بيانات الطالب">✏️ تعديل</button>
                          <button class="table-btn-danger" @click="handleDeleteStudent(st.id)" title="حذف الطالب">حذف</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredStudents.length === 0">
                      <td colspan="6" class="empty-table-msg">لا يوجد طلاب مطابقين لمعايير البحث حالياً.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- MODULE 6: STUDENT DETAILS FULL PAGE VIEW -->
            <div v-else-if="activeModule === 'student-details' && selectedStudent" class="tab-pane-content">
              <div class="desktop-card-box student-profile-card">
                <!-- Top Header with Back Button -->
                <div class="card-box-header flex-between">
                  <div class="flex-actions-gap">
                    <button class="back-to-structure-btn" @click="activeModule = 'students'">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span>العودة لقائمة الطلاب</span>
                    </button>
                    <div class="sec-title-meta">
                      <h3 class="card-box-title">🎓 الملف الشخصي للطالب: {{ selectedStudent.full_name }}</h3>
                      <span class="card-box-sub">كود الطالب: {{ selectedStudent.student_code }} • رقم الجلوس: {{ selectedStudent.roll_number }}</span>
                    </div>
                  </div>

                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="openTransferStudentModal(selectedStudent)">
                      🔄 نقل الطالب
                    </button>
                    <button class="desktop-secondary-btn" @click="openEditStudentModal(selectedStudent)">
                      ✏️ تعديل البيانات
                    </button>
                    <button class="desktop-primary-btn" @click="handleDeleteStudent(selectedStudent.id)">
                      🗑️ حذف الطالب
                    </button>
                  </div>
                </div>

                <!-- Student Profile Details Grid -->
                <div class="student-profile-body">
                  <div class="profile-hero-banner">
                    <div class="profile-avatar-big">🎓</div>
                    <div class="profile-hero-info">
                      <h2 class="profile-student-name">{{ selectedStudent.full_name }}</h2>
                      <div class="profile-badges-row">
                        <span class="profile-badge purple">🏫 {{ selectedStudent.grade_name }}</span>
                        <span class="profile-badge indigo">🏢 الشعبة {{ selectedStudent.section_name }}</span>
                        <span class="profile-badge emerald">🟢 حالة قيد نشطة</span>
                      </div>
                    </div>
                  </div>

                  <div class="profile-info-grid">
                    <div class="info-card-box">
                      <h4 class="info-card-title">📌 البيانات الأكاديمية والتعريفية</h4>
                      <div class="info-details-list">
                        <div class="info-row-item">
                          <span class="info-lbl">الاسم الكامل:</span>
                          <span class="info-val"><strong>{{ selectedStudent.full_name }}</strong></span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">كود الطالب المميز:</span>
                          <span class="info-val"><code>{{ selectedStudent.student_code }}</code></span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">رقم الجلوس:</span>
                          <span class="info-val"><strong>{{ selectedStudent.roll_number }}</strong></span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">الصف الدراسي الحالي:</span>
                          <span class="info-val">{{ selectedStudent.grade_name }}</span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">الشعبة / القاعة:</span>
                          <span class="info-val">الشعبة {{ selectedStudent.section_name }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="info-card-box">
                      <h4 class="info-card-title">📊 السجل الأكاديمي والتحصيل</h4>
                      <div class="info-details-list">
                        <div class="info-row-item">
                          <span class="info-lbl">نسبة الحضور والتواجد:</span>
                          <span class="info-val success">98% (منتظم)</span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">معدل التقييمات الشهرية:</span>
                          <span class="info-val info">ممتاز (A)</span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">المهام والواجبات المنجزة:</span>
                          <span class="info-val">12 واجب ممتثل</span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">حالة الرسوم والحساب:</span>
                          <span class="info-val success">مسدد بالكامل 🟢</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- MODULE 3: المعلم (Teacher Management) -->
            <div v-else-if="activeModule === 'teachers'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">👨‍🏫 إدارة المعلمين والتكليفات المدرسية</h3>
                    <p class="card-box-sub">انقر على أي معلم لمشاهدة ملخص التكليفات الأكاديمية أو إدراج معلم وتكليفات جديدة</p>
                  </div>
                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="showAddAssignModal = true">
                      🔗 تكليف معلم بالمادة
                    </button>
                    <button class="desktop-primary-btn" @click="showAddTeacherModal = true">
                      ➕ إضافة معلم جديد
                    </button>
                  </div>
                </div>

                <!-- Search Filter for Teachers -->
                <div class="teachers-filter-row" style="margin-bottom: 16px;">
                  <input 
                    type="text" 
                    v-model="teacherSearchQuery" 
                    placeholder="🔍 بحث باسم المعلم أو اسم المستخدم..." 
                    class="form-input"
                  />
                </div>

                <table class="desktop-table">
                  <thead>
                    <tr>
                      <th>الاسم الكامل للمعلم</th>
                      <th>اسم المستخدم</th>
                      <th>التكليفات المسندة</th>
                      <th>إجراءات الإدارة</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr 
                      v-for="t in filteredTeachers" 
                      :key="t.id"
                      class="clickable-student-row"
                      @click="openTeacherDetail(t)"
                      title="اضغط لعرض الملف والأكاديمي التكليفات للمعلم"
                    >
                      <td class="flex-align-gap">
                        <span class="clickable-name">👨‍🏫 {{ t.full_name }}</span>
                      </td>
                      <td><code>{{ t.username }}</code></td>
                      <td>
                        <span class="count-tag-pill">{{ getTeacherAssignmentCount(t.id) }} مواد</span>
                      </td>
                      <td @click.stop>
                        <div class="table-actions-inline">
                          <button class="table-btn-secondary" @click="openAssignForTeacher(t)" title="تكليف مادة للمعلم">🔗 تكليف</button>
                          <button class="table-btn-danger" @click="handleDeleteTeacher(t.id)" title="حذف المعلم">حذف المعلم</button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="filteredTeachers.length === 0">
                      <td colspan="4" class="empty-table-msg">لا يوجد معلمون مطابقين لمعايير البحث حالياً.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- MODULE 7: TEACHER DETAILS FULL PAGE VIEW -->
            <div v-else-if="activeModule === 'teacher-details' && selectedTeacher" class="tab-pane-content">
              <div class="desktop-card-box student-profile-card">
                <!-- Top Header with Back Button -->
                <div class="card-box-header flex-between">
                  <div class="flex-actions-gap">
                    <button class="back-to-structure-btn" @click="activeModule = 'teachers'">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span>العودة لقائمة المعلمين</span>
                    </button>
                    <div class="sec-title-meta">
                      <h3 class="card-box-title">👨‍🏫 الملف الأكاديمي للمعلم: {{ selectedTeacher.full_name }}</h3>
                      <span class="card-box-sub">اسم المستخدم: {{ selectedTeacher.username }} • كادر التدريس المعتمد</span>
                    </div>
                  </div>

                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="openAssignForTeacher(selectedTeacher)">
                      🔗 تكليف بمادة جديدة
                    </button>
                    <button class="desktop-primary-btn" @click="handleDeleteTeacher(selectedTeacher.id)">
                      🗑️ حذف حساب المعلم
                    </button>
                  </div>
                </div>

                <!-- Teacher Profile Details Grid -->
                <div class="student-profile-body">
                  <div class="profile-hero-banner">
                    <div class="profile-avatar-big">👨‍🏫</div>
                    <div class="profile-hero-info">
                      <h2 class="profile-student-name">{{ selectedTeacher.full_name }}</h2>
                      <div class="profile-badges-row">
                        <span class="profile-badge purple">👤 {{ selectedTeacher.username }}</span>
                        <span class="profile-badge indigo">📖 التكليفات المسندة: {{ teacherAssignments.length }}</span>
                        <span class="profile-badge emerald">🟢 كادر تدريسي معتمد</span>
                      </div>
                    </div>
                  </div>

                  <div class="profile-info-grid">
                    <div class="info-card-box">
                      <h4 class="info-card-title">📌 بيانات الحساب والكادر</h4>
                      <div class="info-details-list">
                        <div class="info-row-item">
                          <span class="info-lbl">الاسم الكامل للمعلم:</span>
                          <span class="info-val"><strong>{{ selectedTeacher.full_name }}</strong></span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">اسم المستخدم (Username):</span>
                          <span class="info-val"><code>{{ selectedTeacher.username }}</code></span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">الصفة الأكاديمية:</span>
                          <span class="info-val">أستاذ مادة / كادر منظم</span>
                        </div>
                        <div class="info-row-item">
                          <span class="info-lbl">حالة الصلاحيات والمنظومة:</span>
                          <span class="info-val success">مفعل 🟢</span>
                        </div>
                      </div>
                    </div>

                    <div class="info-card-box">
                      <h4 class="info-card-title">📖 التكليفات الأكاديمية المسندة (إجمالي {{ teacherAssignments.length }})</h4>
                      <div class="info-details-list">
                        <table class="desktop-table" v-if="teacherAssignments.length > 0">
                          <thead>
                            <tr>
                              <th>المادة الدراسية</th>
                              <th>الصف والشعبة</th>
                              <th>إجراء</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="a in teacherAssignments" :key="a.id">
                              <td><span class="sec-pill-tag subject">📖 {{ a.subject_name }}</span></td>
                              <td>{{ a.grade_name }} ({{ a.section_name }})</td>
                              <td>
                                <button class="table-btn-danger" @click="handleDeleteAssign(a.id)">إزالة</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div v-else class="empty-table-msg" style="padding: 16px 0;">
                          لا توجد مواد أو صفوف مكلف بها هذا المعلم حالياً.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <!-- MODULE 4: الجدول الدراسي (Schedule / Timetable) -->
            <div v-else-if="activeModule === 'schedule'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">📅 الجدول الدراسي وإدارة الحصص الأسبوعية</h3>
                    <p class="card-box-sub" v-if="!selectedScheduleSectionId">
                      جدول اليوم الحالي لجميع الفصول والشعب الدراسية (من الحصة 1 إلى الحصة 6)
                    </p>
                    <p class="card-box-sub" v-else>
                      الجدول الدراسي الأسبوعي للشعبة المحددة (من الأحد إلى الخميس - 6 حصص يومياً)
                    </p>
                  </div>
                  <div class="flex-actions-gap">
                    <label class="form-label inline-label" style="margin: 0; align-self: center;">تصفية حسب الشعبة:</label>
                    <select v-model="selectedScheduleSectionId" class="form-input select-schedule-filter" style="width: auto; min-width: 240px;">
                      <option value="">🏫 جميع الشعب (جدول اليوم الحالي)</option>
                      <template v-for="g in grades" :key="g.id">
                        <option v-for="sec in g.sections" :key="sec.id" :value="sec.id">
                          {{ g.name }} - الشعبة {{ sec.name }}
                        </option>
                      </template>
                    </select>
                  </div>
                </div>

                <!-- STATE A: DEFAULT VIEW - TODAY'S SCHEDULE FOR ALL CLASSROOMS -->
                <div v-if="!selectedScheduleSectionId" class="all-classes-today-schedule">
                  <div class="flex-between body-header-margin" style="margin-bottom: 14px; align-items: center;">
                    <div class="day-switcher-bar">
                      <span class="day-bar-label">📅 اليوم المعروض:</span>
                      <button 
                        v-for="d in ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس']" 
                        :key="d"
                        class="day-pill-btn"
                        :class="{ active: selectedScheduleDay === d }"
                        @click="selectedScheduleDay = d"
                      >
                        {{ d }}
                      </button>
                    </div>
                    <span class="count-tag-pill">إجمالي {{ allSectionsDailySchedule.length }} شعبة مسجلة</span>
                  </div>

                  <div class="schedule-table-wrapper">
                    <table class="desktop-schedule-table master-daily-table">
                      <thead>
                        <tr>
                          <th class="day-col-header" style="width: 220px;">الفصل الدراسي والشعبة</th>
                          <th v-for="p in 6" :key="p" class="period-col-header">الحصة {{ p }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in allSectionsDailySchedule" :key="`${item.gradeId}-${item.sectionId}`">
                          <td class="day-name-cell section-label-cell">
                            <strong class="grade-text">{{ item.gradeName }}</strong>
                            <span class="sec-text" v-if="item.sectionName !== 'بدون شعبة'">الشعبة {{ item.sectionName }}</span>
                          </td>
                          <td v-for="slot in item.slots" :key="slot.period" class="period-slot-cell">
                            <div class="slot-cell-content">
                              <strong class="slot-sub-text">{{ slot.subject }}</strong>
                              <span class="slot-teacher-text">{{ slot.teacher }}</span>
                            </div>
                          </td>
                        </tr>
                        <tr v-if="allSectionsDailySchedule.length === 0">
                          <td colspan="7" class="empty-table-msg">لا توجد شعب منشأة لعرض جدولها.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- STATE B: SPECIFIC SECTION SELECTED - FULL WEEKLY SCHEDULE -->
                <div v-else class="schedule-table-wrapper">
                  <div class="flex-between body-header-margin" style="margin-bottom: 14px;">
                    <h4 class="col-box-title">
                      📅 الجدول الأسبوعي
                      <span v-if="selectedScheduleSectionObj">
                        لـ ({{ selectedScheduleSectionObj.grade.name }} - الشعبة {{ selectedScheduleSectionObj.section.name }})
                      </span>
                    </h4>
                    <button class="desktop-secondary-btn small-btn" @click="selectedScheduleSectionId = ''">
                      🔙 العودة لجدول جميع الفصول
                    </button>
                  </div>

                  <table class="desktop-schedule-table">
                    <thead>
                      <tr>
                        <th class="day-col-header">اليوم / الحصص</th>
                        <th v-for="p in 6" :key="p" class="period-col-header">الحصة {{ p }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="day in sectionScheduleDays" :key="day.dayName">
                        <td class="day-name-cell">
                          <strong>{{ day.dayName }}</strong>
                        </td>
                        <td v-for="slot in day.slots" :key="slot.period" class="period-slot-cell">
                          <div class="slot-cell-content">
                            <strong class="slot-sub-text">{{ slot.subject }}</strong>
                            <span class="slot-teacher-text">{{ slot.teacher }}</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            <!-- MODULE 5: SECTION DETAILS FULL PAGE VIEW -->
            <div v-else-if="activeModule === 'section-details' && selectedSection" class="tab-pane-content">
              <div class="desktop-card-box section-full-page-card">
                <!-- Header with Back Button -->
                <div class="card-box-header flex-between">
                  <div class="flex-actions-gap">
                    <button class="back-to-structure-btn" @click="activeModule = 'classrooms'">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      <span>العودة لصفحة الفصول الدراسية</span>
                    </button>
                    <div class="sec-title-meta">
                      <h3 class="card-box-title">🏫 تفاصيل الشعبة {{ selectedSection.name }}</h3>
                      <span class="card-box-sub" v-if="selectedGrade">الصف الدراسي: {{ selectedGrade.name }}</span>
                    </div>
                  </div>

                  <span class="tag-pill-primary">شعبة مقيدة ونشطة</span>
                </div>

                <!-- Full Page 3 Tabs Header Switcher -->
                <div class="full-page-sec-tabs">
                  <button 
                    class="full-sec-tab-btn" 
                    :class="{ active: activeSectionTab === 'schedule' }"
                    @click="activeSectionTab = 'schedule'"
                  >
                    📅 الجدول الدراسي (الافتراضية)
                  </button>
                  <button 
                    class="full-sec-tab-btn" 
                    :class="{ active: activeSectionTab === 'students' }"
                    @click="activeSectionTab = 'students'"
                  >
                    🎓 الطلاب المسجلون ({{ sectionStudents.length }})
                  </button>
                  <button 
                    class="full-sec-tab-btn" 
                    :class="{ active: activeSectionTab === 'teachers' }"
                    @click="activeSectionTab = 'teachers'"
                  >
                    👨‍🏫 المعلمون المكلفون ({{ sectionTeachers.length }})
                  </button>
                </div>

                <!-- TAB 1: الجدول الدراسي (الافتراضية - الأيام كصفوف والمواد كأعمدة) -->
                <div v-if="activeSectionTab === 'schedule'" class="full-tab-body">
                  <div class="flex-between body-header-margin">
                    <h4 class="col-box-title">📅 الجدول الأسبوعي لشعبة {{ selectedSection.name }} (من الأحد إلى الخميس - 6 حصص يومياً)</h4>
                    <span class="count-tag-pill">6 حصص يومياً</span>
                  </div>

                  <div class="schedule-table-wrapper">
                    <table class="desktop-schedule-table">
                      <thead>
                        <tr>
                          <th class="day-col-header">اليوم / الحصص</th>
                          <th v-for="p in 6" :key="p" class="period-col-header">الحصة {{ p }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="day in sectionScheduleDays" :key="day.dayName">
                          <td class="day-name-cell">
                            <strong>{{ day.dayName }}</strong>
                          </td>
                          <td v-for="slot in day.slots" :key="slot.period" class="period-slot-cell">
                            <div class="slot-cell-content">
                              <strong class="slot-sub-text">{{ slot.subject }}</strong>
                              <span class="slot-teacher-text">{{ slot.teacher }}</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- TAB 2: الطلاب -->
                <div v-else-if="activeSectionTab === 'students'" class="full-tab-body">
                  <div class="flex-between body-header-margin">
                    <h4 class="col-box-title">🎓 قائمة الطلاب المسجلون بشعبة {{ selectedSection.name }} (إجمالي {{ sectionStudents.length }})</h4>
                    <button class="desktop-primary-btn" @click="showAddStudentModal = true">➕ إضافة طالب جديد لهذه الشعبة</button>
                  </div>

                  <table class="desktop-table">
                    <thead>
                      <tr>
                        <th>رقم الجلوس</th>
                        <th>كود الطالب</th>
                        <th>الاسم الكامل للطالب</th>
                        <th>الصف الدراسي</th>
                        <th>إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="st in sectionStudents" :key="st.id">
                        <td><strong>{{ st.roll_number }}</strong></td>
                        <td><code>{{ st.student_code }}</code></td>
                        <td>{{ st.full_name }}</td>
                        <td>{{ st.grade_name || (selectedGrade ? selectedGrade.name : '') }}</td>
                        <td>
                          <button class="table-btn-danger" @click="handleDeleteStudent(st.id)">حذف الطالب</button>
                        </td>
                      </tr>
                      <tr v-if="sectionStudents.length === 0">
                        <td colspan="5" class="empty-table-msg">لا يوجد طلاب مسجلون بهذه الشعبة حالياً.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TAB 3: المعلمين -->
                <div v-else-if="activeSectionTab === 'teachers'" class="full-tab-body">
                  <div class="flex-between body-header-margin">
                    <h4 class="col-box-title">👨‍🏫 كادر المعلمين المكلفين بتدريس مادة بشعبة {{ selectedSection.name }}</h4>
                    <button class="desktop-secondary-btn" @click="showAddAssignModal = true">🔗 تكليف معلم جديد بهذه الشعبة</button>
                  </div>

                  <table class="desktop-table">
                    <thead>
                      <tr>
                        <th>اسم المعلم</th>
                        <th>المادة الدراسية المكلف بها</th>
                        <th>الصف والدور</th>
                        <th>إجراء</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="t in sectionTeachers" :key="t.id">
                        <td><strong>{{ t.teacher_name }}</strong></td>
                        <td><span class="sec-pill-tag subject">📖 {{ t.subject_name }}</span></td>
                        <td>{{ t.grade_name }} (الشعبة {{ selectedSection.name }})</td>
                        <td><button class="table-btn-danger" @click="handleDeleteAssign(t.id)">إزالة التكليف</button></td>
                      </tr>
                      <tr v-if="sectionTeachers.length === 0">
                        <td colspan="4" class="empty-table-msg">لا يوجد معلمون مكلفون لهذه الشعبة حالياً.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

            <!-- MODULE 5: الإحصاءات والتقارير اليومية (Daily Analytics & Reports) -->
            <div v-else-if="activeModule === 'analytics'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">📊 التقرير والمؤشرات الإحصائية اليومية للمنظومة</h3>
                    <p class="card-box-sub">متابعة دقيقة لمعدلات حضور الطلاب والمعلمين، الواجبات والامتحانات المنشورة، ونشاط الفصول</p>
                  </div>
                  <div class="flex-actions-gap">
                    <button class="desktop-secondary-btn" @click="printAnalyticsReport">
                      🖨️ طباعة التقرير اليومي
                    </button>
                    <span class="count-tag-pill" style="align-self: center; font-size: 13px;">
                      📅 اليوم: {{ currentFormattedDate }}
                    </span>
                  </div>
                </div>

                <!-- 4 Main Daily Analytics Banners -->
                <div class="analytics-cards-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
                  
                  <!-- Card 1: Students Attendance -->
                  <div class="info-card-box analytics-metric-card purple-border">
                    <div class="metric-card-header flex-between">
                      <span class="metric-title">🎓 حضور وغياب الطلاب</span>
                      <span class="profile-badge emerald">{{ dailyAnalytics.studentsRate }}% حضور</span>
                    </div>
                    <div class="metric-big-val">{{ dailyAnalytics.studentsPresent }} <span class="metric-sub-unit">/ {{ dailyAnalytics.studentsTotal }} طالب</span></div>
                    <div class="metric-bar-wrapper">
                      <div class="metric-bar-fill emerald" :style="{ width: dailyAnalytics.studentsRate + '%' }"></div>
                    </div>
                    <div class="metric-footer-row flex-between">
                      <span class="metric-stat success">🟢 الحضور: {{ dailyAnalytics.studentsPresent }}</span>
                      <span class="metric-stat danger">🔴 الغياب: {{ dailyAnalytics.studentsAbsent }}</span>
                    </div>
                  </div>

                  <!-- Card 2: Teachers Attendance -->
                  <div class="info-card-box analytics-metric-card indigo-border">
                    <div class="metric-card-header flex-between">
                      <span class="metric-title">👨‍🏫 حضور وغياب المعلمين</span>
                      <span class="profile-badge emerald">{{ dailyAnalytics.teachersRate }}% حضور</span>
                    </div>
                    <div class="metric-big-val">{{ dailyAnalytics.teachersPresent }} <span class="metric-sub-unit">/ {{ dailyAnalytics.teachersTotal }} معلم</span></div>
                    <div class="metric-bar-wrapper">
                      <div class="metric-bar-fill indigo" :style="{ width: dailyAnalytics.teachersRate + '%' }"></div>
                    </div>
                    <div class="metric-footer-row flex-between">
                      <span class="metric-stat success">🟢 الحضور: {{ dailyAnalytics.teachersPresent }}</span>
                      <span class="metric-stat warning">🟡 الغياب: {{ dailyAnalytics.teachersAbsent }}</span>
                    </div>
                  </div>

                  <!-- Card 3: Homework & Assignments -->
                  <div class="info-card-box analytics-metric-card emerald-border">
                    <div class="metric-card-header flex-between">
                      <span class="metric-title">📚 الواجبات والتكليفات</span>
                      <span class="profile-badge purple">{{ dailyAnalytics.homeworkComplianceRate }}% التزام</span>
                    </div>
                    <div class="metric-big-val">{{ dailyAnalytics.totalHomeworks }} <span class="metric-sub-unit">واجب منشور</span></div>
                    <div class="metric-bar-wrapper">
                      <div class="metric-bar-fill purple" :style="{ width: dailyAnalytics.homeworkComplianceRate + '%' }"></div>
                    </div>
                    <div class="metric-footer-row flex-between">
                      <span class="metric-stat info">📖 النشطة: {{ dailyAnalytics.activeHomeworks }}</span>
                      <span class="metric-stat neutral">إجمالي: {{ dailyAnalytics.totalHomeworks }}</span>
                    </div>
                  </div>

                  <!-- Card 4: Exams & Tests -->
                  <div class="info-card-box analytics-metric-card amber-border">
                    <div class="metric-card-header flex-between">
                      <span class="metric-title">📝 الامتحانات والتقييمات</span>
                      <span class="profile-badge amber">نشط هذا الأسبوع</span>
                    </div>
                    <div class="metric-big-val">{{ dailyAnalytics.totalExams }} <span class="metric-sub-unit">امتحان مجدول</span></div>
                    <div class="metric-bar-wrapper">
                      <div class="metric-bar-fill amber" style="width: 75%;"></div>
                    </div>
                    <div class="metric-footer-row flex-between">
                      <span class="metric-stat warning">📝 اليوم: {{ dailyAnalytics.todayExams }} امتحانات</span>
                      <span class="metric-stat info">📅 قادمة: {{ dailyAnalytics.upcomingExams }}</span>
                    </div>
                  </div>

                </div>

                <!-- 2 Split Columns: Grade-by-Grade Breakdown & Detailed Activity -->
                <div class="profile-info-grid" style="grid-template-columns: 1fr 1fr; gap: 20px;">
                  
                  <!-- Left Col: Attendance Breakdown By Grade -->
                  <div class="info-card-box">
                    <h4 class="info-card-title flex-between">
                      <span>🏫 نسبة وسجل الحضور اليومي حسب الصفوف الدراسية</span>
                      <span class="count-tag-pill">9 صفوف</span>
                    </h4>
                    <div class="info-details-list">
                      <div v-for="gAtt in gradeAttendanceBreakdown" :key="gAtt.gradeName" class="grade-att-row" style="margin-bottom: 12px;">
                        <div class="flex-between" style="font-size: 13px; margin-bottom: 4px;">
                          <strong style="color: #0f172a;">{{ gAtt.gradeName }}</strong>
                          <span class="metric-stat success" style="font-weight: 700;">{{ gAtt.rate }}% ({{ gAtt.present }} حضور / {{ gAtt.absent }} غياب)</span>
                        </div>
                        <div class="metric-bar-wrapper" style="height: 8px;">
                          <div class="metric-bar-fill emerald" :style="{ width: gAtt.rate + '%' }"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Col: System Operational Stats & Daily Subject Tasks -->
                  <div class="info-card-box">
                    <h4 class="info-card-title flex-between">
                      <span>📋 التوزيع اليومي للمواد والنشاط التعليمي</span>
                      <span class="count-tag-pill">مؤشرات الأداء</span>
                    </h4>
                    <div class="info-details-list">
                      <div class="info-row-item" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                        <span class="info-lbl">⚡ نسبة اكتمال الحصص اليومية:</span>
                        <span class="info-val success"><strong>100% (36 حصة منفذة)</strong></span>
                      </div>
                      <div class="info-row-item" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                        <span class="info-lbl">📐 الواجبات الأعلى نشاطاً (الرياضيات):</span>
                        <span class="info-val">8 واجبات منزلية</span>
                      </div>
                      <div class="info-row-item" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                        <span class="info-lbl">🔬 واجبات وتقارير العلوم العامة:</span>
                        <span class="info-val">6 واجبات منشورة</span>
                      </div>
                      <div class="info-row-item" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                        <span class="info-lbl">📖 تطبيقات وإعراب اللغة العربية:</span>
                        <span class="info-val">5 واجبات معتمدة</span>
                      </div>
                      <div class="info-row-item" style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                        <span class="info-lbl">🏫 القاعات والمعامل الدراسية الشاغرة:</span>
                        <span class="info-val info"><strong>0 (تغطية شاملة)</strong></span>
                      </div>
                      <div class="info-row-item" style="padding: 10px 0;">
                        <span class="info-lbl">🟢 تقييم انتظام اليوم الدراسي:</span>
                        <span class="info-val success"><strong>ممتاز جداً (97% امتثال)</strong></span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <!-- CREATION MODULE (مركز الإضافات) -->
            <div v-else-if="activeModule === 'creation'" class="tab-pane-content">
              <div class="desktop-card-box">
                <div class="card-box-header flex-between">
                  <div>
                    <h3 class="card-box-title">➕ مركز الإضافات وإدارة العمليات الموحد</h3>
                    <p class="card-box-sub">صفحة مخصصة لإضافة وتدشين كافة مكونات المنظومة التعليمية (فصل دراسي، شعبة، طالب، معلم، مادة)</p>
                  </div>
                  <span class="tag-pill-primary">5 نماذج إضافة فورية</span>
                </div>

                <div class="creation-forms-grid">
                  <!-- 1. إضافة فصل دراسي -->
                  <div class="creation-form-card">
                    <div class="creation-card-header">
                      <div class="creation-icon purple">🏫</div>
                      <div>
                        <h4 class="creation-card-title">1- إضافة فصل / صف دراسي</h4>
                        <p class="creation-card-desc">إدراج سنة أو صف دراسي جديد بقاعدة البيانات</p>
                      </div>
                    </div>

                    <form @submit.prevent="handleCreateGradeFromPage" class="creation-form-body">
                      <div class="form-group">
                        <label class="form-label">اسم الصف الدراسي *</label>
                        <input type="text" v-model="newGradeForm.name" placeholder="مثال: الصف العاشر" required class="form-input" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">رقم المستوى (Level) *</label>
                        <input type="number" v-model.number="newGradeForm.level" placeholder="مثال: 10" required class="form-input" />
                      </div>
                      <button type="submit" class="creation-submit-btn">إضافة فصل دراسي جديد 🚀</button>
                    </form>
                  </div>

                  <!-- 2. إضافة شعبة -->
                  <div class="creation-form-card">
                    <div class="creation-card-header">
                      <div class="creation-icon emerald">🏢</div>
                      <div>
                        <h4 class="creation-card-title">2- إضافة شعبة جديدة</h4>
                        <p class="creation-card-desc">إنشاء وتخصيص شعبة أو قاعة لصف دراسي</p>
                      </div>
                    </div>

                    <form @submit.prevent="handleCreateSectionFromPage" class="creation-form-body">
                      <div class="form-group">
                        <label class="form-label">اختر الصف الدراسي *</label>
                        <select v-model="newSectionForm.grade_id" required class="form-input">
                          <option value="" disabled>اختر الصف...</option>
                          <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">اسم الشعبة *</label>
                        <input type="text" v-model="newSectionForm.name" placeholder="مثال: 8أ أو الشعبة 5ب" required class="form-input" />
                      </div>
                      <button type="submit" class="creation-submit-btn">إضافة الشعبة 🚀</button>
                    </form>
                  </div>

                  <!-- 3. إضافة طالب -->
                  <div class="creation-form-card">
                    <div class="creation-card-header">
                      <div class="creation-icon indigo">🎓</div>
                      <div>
                        <h4 class="creation-card-title">3- إضافة طالب جديد</h4>
                        <p class="creation-card-desc">تسجيل بيانات طالب جديد برقم الجلوس والكود</p>
                      </div>
                    </div>

                    <form @submit.prevent="handleAddStudent" class="creation-form-body">
                      <div class="form-group">
                        <label class="form-label">الاسم الكامل للطالب *</label>
                        <input type="text" v-model="newStudent.full_name" placeholder="اسم الطالب الثلاثي" required class="form-input" />
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">رقم الجلوس *</label>
                          <input type="text" v-model="newStudent.roll_number" placeholder="1005" required class="form-input" />
                        </div>
                        <div class="form-group">
                          <label class="form-label">كود الطالب *</label>
                          <input type="text" v-model="newStudent.student_code" placeholder="ST1005" required class="form-input" />
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label class="form-label">الصف الدراسي *</label>
                          <select v-model="newStudent.grade_id" required class="form-input">
                            <option value="" disabled>اختر الصف...</option>
                            <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label class="form-label">الشعبة *</label>
                          <select v-model="newStudent.section_id" required class="form-input">
                            <option value="" disabled>اختر الشعبة...</option>
                            <option v-for="sec in availableSectionsForNewStudent" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" class="creation-submit-btn">تسجيل الطالب بقاعدة البيانات 🚀</button>
                    </form>
                  </div>

                  <!-- 4. إضافة معلم -->
                  <div class="creation-form-card">
                    <div class="creation-card-header">
                      <div class="creation-icon amber">👨‍🏫</div>
                      <div>
                        <h4 class="creation-card-title">4- إضافة حساب معلم جديد</h4>
                        <p class="creation-card-desc">إنشاء حساب معتمد جديد لكادر التدريس</p>
                      </div>
                    </div>

                    <form @submit.prevent="handleAddTeacher" class="creation-form-body">
                      <div class="form-group">
                        <label class="form-label">الاسم الكامل للمعلم *</label>
                        <input type="text" v-model="newTeacher.full_name" placeholder="اسم المعلم الثلاثي" required class="form-input" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">اسم المستخدم (Username) *</label>
                        <input type="text" v-model="newTeacher.username" placeholder="teacher2" required class="form-input" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">كلمة المرور *</label>
                        <input type="password" v-model="newTeacher.password" required class="form-input" />
                      </div>
                      <button type="submit" class="creation-submit-btn">إنشاء حساب المعلم 🚀</button>
                    </form>
                  </div>

                  <!-- 5. إضافة مادة دراسية -->
                  <div class="creation-form-card">
                    <div class="creation-card-header">
                      <div class="creation-icon teal">📖</div>
                      <div>
                        <h4 class="creation-card-title">5- إضافة مادة دراسية</h4>
                        <p class="creation-card-desc">إدراج وتخصيص مادة دراسية لصف معين</p>
                      </div>
                    </div>

                    <form @submit.prevent="handleCreateSubjectFromPage" class="creation-form-body">
                      <div class="form-group">
                        <label class="form-label">اختر الصف الدراسي *</label>
                        <select v-model="newSubjectForm.grade_id" required class="form-input">
                          <option value="" disabled>اختر الصف...</option>
                          <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">اسم المادة الدراسية *</label>
                        <input type="text" v-model="newSubjectForm.name" placeholder="مثال: الفيزياء الكلاسيكية" required class="form-input" />
                      </div>
                      <button type="submit" class="creation-submit-btn">حفظ وإدراج المادة 🚀</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT SIDEBAR DESKTOP WIDGETS (1fr) -->
          <div class="desktop-content-right">
            <!-- Sidebar Widget 1: Quick Admin Actions -->
            <div class="desktop-card-box widget-card">
              <h4 class="widget-title">⚡ إجراءات إدارية سريعة</h4>
              <div class="quick-actions-list">
                <button class="quick-action-btn" @click="showAddStudentModal = true">
                  <span class="qa-icon">🎓</span>
                  <div class="qa-text">
                    <span class="qa-main">إضافة طالب جديد</span>
                    <span class="qa-sub">تسجيل طالب وتخصيص الصف</span>
                  </div>
                </button>

                <button class="quick-action-btn" @click="showAddTeacherModal = true">
                  <span class="qa-icon">👨‍🏫</span>
                  <div class="qa-text">
                    <span class="qa-main">إضافة معلم جديد</span>
                    <span class="qa-sub">إنشاء حساب جديد بالمنظومة</span>
                  </div>
                </button>

                <button class="quick-action-btn" @click="showAddAssignModal = true">
                  <span class="qa-icon">🔗</span>
                  <div class="qa-text">
                    <span class="qa-main">تكليف معلم بمادة</span>
                    <span class="qa-sub">ربط المعلم بالشعبة والمادة</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Sidebar Widget 2: Live Activity Feed Log -->
            <div class="desktop-card-box widget-card">
              <div class="flex-between">
                <h4 class="widget-title">⚡ سجل الأحداث اللحظية</h4>
                <span class="dot-live-badge">مباشر</span>
              </div>
              <div class="activity-feed-list">
                <div v-for="act in activityLogs" :key="act.id" class="activity-feed-item">
                  <div class="feed-icon" :class="act.typeClass">{{ act.icon }}</div>
                  <div class="feed-body">
                    <p class="feed-text">{{ act.title }}</p>
                    <span class="feed-time">{{ act.time }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar Widget 3: School System Info -->
            <div class="desktop-card-box widget-card info-gradient-card">
              <h4 class="widget-title light">🏫 حالة المنظومة المدرسية</h4>
              <div class="system-meta-list">
                <div class="meta-row-item">
                  <span class="meta-lbl">العام الدراسي:</span>
                  <span class="meta-val">2025/2026</span>
                </div>
                <div class="meta-row-item">
                  <span class="meta-lbl">الفصل الدراسي:</span>
                  <span class="meta-val">الفصل الأول</span>
                </div>
                <div class="meta-row-item">
                  <span class="meta-lbl">حالة السيرفر:</span>
                  <span class="meta-val success">سليم ومستقر 🟢</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>

    <!-- Task Side Drawer (دراوير جانبي ينزلق بـ 0.7s) -->
    <ShadcnDrawer 
      v-model="isDrawerOpen" 
      :title="selectedTask ? selectedTask.title : 'تفاصيل المهمة المدرسية'"
      :description="selectedTask ? `مادة ${selectedTask.subject_name} • ${selectedTask.grade_name || ''} (${selectedTask.section_name || ''})` : ''"
      :icon="selectedTask ? getTaskIcon(selectedTask.task_type) : '📝'"
    >
      <div v-if="selectedTask" class="drawer-exam-details">
        <div class="drawer-status-banner verified">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>مهمة تقييم نشطة ومدرجة بجدول المعلم</span>
        </div>

        <div class="drawer-info-grid">
          <div class="drawer-info-item">
            <span class="info-label">📅 موعد الإنجاز والتسليم</span>
            <span class="info-val">{{ selectedTask.due_date }}</span>
          </div>
          <div class="drawer-info-item">
            <span class="info-label">🏫 الصف والشعبة</span>
            <span class="info-val">{{ selectedTask.grade_name }} ({{ selectedTask.section_name }})</span>
          </div>
          <div class="drawer-info-item">
            <span class="info-label">📖 المادة الدراسية</span>
            <span class="info-val">{{ selectedTask.subject_name }}</span>
          </div>
          <div class="drawer-info-item">
            <span class="info-label">👨‍🏫 المعلم المكلف</span>
            <span class="info-val">{{ selectedTask.teacher_name || 'أستاذ المادة' }}</span>
          </div>
        </div>

        <div class="drawer-section">
          <h4 class="drawer-section-title">📌 مفردات وتفاصيل التقييم:</h4>
          <p class="drawer-text-content">
            {{ selectedTask.description || 'حل تمارين التقييم المعتمدة وتثبيت النتائج بالكراسة الرسمية.' }}
          </p>
        </div>
      </div>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="isDrawerOpen = false">إغلاق</button>
      </template>
    </ShadcnDrawer>

    <!-- Modals -->
    <!-- Add Student Modal -->
    <ShadcnDialog 
      v-model="showAddStudentModal" 
      title="➕ إضافة طالب جديد" 
      description="إدراج طالب جديد بقاعدة البيانات وتخصيص الشعبة"
      icon="🎓"
    >
      <form @submit.prevent="handleAddStudent" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">الاسم الكامل للطالب *</label>
          <input type="text" v-model="newStudent.full_name" required class="form-input" placeholder="اسم الطالب الثلاثي" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">رقم الجلوس *</label>
            <input type="text" v-model="newStudent.roll_number" placeholder="مثال: 1005" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">كود الطالب *</label>
            <input type="text" v-model="newStudent.student_code" placeholder="مثال: ST1005" required class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">الصف الدراسي *</label>
            <select v-model="newStudent.grade_id" required class="form-input">
              <option value="" disabled>اختر الصف...</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">الشعبة *</label>
            <select v-model="newStudent.section_id" required class="form-input">
              <option value="" disabled>اختر الشعبة...</option>
              <option v-for="sec in availableSectionsForNewStudent" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showAddStudentModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleAddStudent">إدراج الطالب 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Transfer Student Modal -->
    <ShadcnDialog 
      v-model="showTransferStudentModal" 
      title="🔄 نقل طالب إلى فصل/شعبة جديدة" 
      description="تغيير صف الطالب وشعبته بقاعدة البيانات"
      icon="🔄"
    >
      <form @submit.prevent="handleTransferStudent" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">اختر الطالب المراد نقله *</label>
          <select v-model="transferForm.student_id" required class="form-input">
            <option value="" disabled>اختر طالب...</option>
            <option v-for="st in students" :key="st.id" :value="st.id">
              {{ st.full_name }} (كود: {{ st.student_code }} - {{ st.grade_name }})
            </option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">الصف الدراسي الجديد *</label>
            <select v-model="transferForm.grade_id" required class="form-input">
              <option value="" disabled>اختر الصف الجديد...</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">الشعبة الجديدة *</label>
            <select v-model="transferForm.section_id" required class="form-input">
              <option value="" disabled>اختر الشعبة الجديدة...</option>
              <option v-for="sec in availableSectionsForTransfer" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showTransferStudentModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleTransferStudent">نقل الطالب الآن 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Edit Student Modal -->
    <ShadcnDialog 
      v-model="showEditStudentModal" 
      title="✏️ تعديل بيانات طالب" 
      description="تحديث البيانات الأساسية ورقم الجلوس والكود للطالب"
      icon="✏️"
    >
      <form @submit.prevent="handleUpdateStudent" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">الاسم الكامل للطالب *</label>
          <input type="text" v-model="editStudentForm.full_name" required class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">رقم الجلوس *</label>
            <input type="text" v-model="editStudentForm.roll_number" required class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">كود الطالب *</label>
            <input type="text" v-model="editStudentForm.student_code" required class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">الصف الدراسي *</label>
            <select v-model="editStudentForm.grade_id" required class="form-input">
              <option value="" disabled>اختر الصف...</option>
              <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">الشعبة *</label>
            <select v-model="editStudentForm.section_id" required class="form-input">
              <option value="" disabled>اختر الشعبة...</option>
              <option v-for="sec in availableSectionsForEdit" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showEditStudentModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleUpdateStudent">حفظ التحديثات 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Add Teacher Modal -->
    <ShadcnDialog 
      v-model="showAddTeacherModal" 
      title="➕ إضافة حساب معلم جديد" 
      description="إنشاء حساب جديد لكادر التدريس"
      icon="👨‍🏫"
    >
      <form @submit.prevent="handleAddTeacher" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">الاسم الكامل للمعلم *</label>
          <input type="text" v-model="newTeacher.full_name" required class="form-input" placeholder="اسم المعلم الثلاثي" />
        </div>
        <div class="form-group">
          <label class="form-label">اسم المستخدم (Username) *</label>
          <input type="text" v-model="newTeacher.username" placeholder="teacher2" required class="form-input" />
        </div>
        <div class="form-group">
          <label class="form-label">كلمة المرور *</label>
          <input type="password" v-model="newTeacher.password" required class="form-input" />
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showAddTeacherModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleAddTeacher">إنشاء الحساب 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Add Assignment Modal -->
    <ShadcnDialog 
      v-model="showAddAssignModal" 
      title="🔗 تكليف معلم بالمادة والشعبة" 
      description="ربط المعلم بصفوف المواد الدراسية"
      icon="🔗"
    >
      <form @submit.prevent="handleAddAssign" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">اختر المعلم *</label>
          <select v-model="newAssign.teacher_id" required class="form-input">
            <option value="" disabled>اختر معلماً...</option>
            <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.full_name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">الصف الدراسي *</label>
          <select v-model="newAssign.grade_id" required class="form-input">
            <option value="" disabled>اختر الصف...</option>
            <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
          </select>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">المادة الدراسية *</label>
            <select v-model="newAssign.subject_id" required class="form-input">
              <option value="" disabled>اختر المادة...</option>
              <option v-for="sub in availableSubjectsForAssign" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">الشعبة *</label>
            <select v-model="newAssign.section_id" required class="form-input">
              <option value="" disabled>اختر الشعبة...</option>
              <option v-for="sec in availableSectionsForAssign" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
            </select>
          </div>
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showAddAssignModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleAddAssign">ربط التكليف 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Add Section Modal -->
    <ShadcnDialog 
      v-model="showAddSectionModal" 
      title="➕ إضافة شعبة جديدة" 
      :description="selectedGradeForModal ? `إضافة قاعة شعبة لـ ${selectedGradeForModal.name}` : ''"
      icon="🏫"
    >
      <form @submit.prevent="handleAddSection" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">اسم الشعبة (مثل: 8أ ، 8ب) *</label>
          <input type="text" v-model="newSectionName" required class="form-input" placeholder="8أ" />
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showAddSectionModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleAddSection">حفظ الشعبة 🚀</button>
      </template>
    </ShadcnDialog>

    <!-- Add Subject Modal -->
    <ShadcnDialog 
      v-model="showAddSubjectModal" 
      title="➕ إضافة مادة دراسية" 
      :description="selectedGradeForModal ? `إدراج مادة دراسية لـ ${selectedGradeForModal.name}` : ''"
      icon="📖"
    >
      <form @submit.prevent="handleAddSubject" class="teacher-create-form">
        <div class="form-group">
          <label class="form-label">اسم المادة (مثل: الرياضيات ، الفيزياء) *</label>
          <input type="text" v-model="newSubjectName" required class="form-input" placeholder="الرياضيات" />
        </div>
      </form>
      <template #footer>
        <button class="shadcn-btn-secondary" @click="showAddSubjectModal = false">إلغاء</button>
        <button class="shadcn-btn-primary" @click="handleAddSubject">حفظ المادة 🚀</button>
      </template>
    </ShadcnDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ShadcnDialog from '../../components/common/ShadcnDialog.vue';
import ShadcnDrawer from '../../components/common/ShadcnDrawer.vue';
import api from '../../services/api';

const router = useRouter();
const loading = ref(true);
const activeModule = ref('classrooms');

const selectedScheduleSectionId = ref('');
const selectedScheduleDay = ref('الخميس');

const selectedScheduleSectionObj = computed(() => {
  if (!selectedScheduleSectionId.value) return null;
  for (const g of grades.value) {
    if (g.sections) {
      const found = g.sections.find(s => Number(s.id) === Number(selectedScheduleSectionId.value));
      if (found) return { section: found, grade: g };
    }
  }
  return null;
});

const allSectionsDailySchedule = computed(() => {
  const result = [];
  const sortedGrades = [...grades.value].sort((a, b) => (a.level || 0) - (b.level || 0));
  
  for (const grade of sortedGrades) {
    if (grade.sections && grade.sections.length > 0) {
      for (const sec of grade.sections) {
        const slots = getSlotsForSectionAndDay(sec, grade, selectedScheduleDay.value);
        result.push({
          gradeId: grade.id,
          gradeName: grade.name,
          sectionId: sec.id,
          sectionName: sec.name,
          slots
        });
      }
    } else {
      result.push({
        gradeId: grade.id,
        gradeName: grade.name,
        sectionId: null,
        sectionName: 'بدون شعبة',
        slots: Array.from({ length: 6 }, (_, i) => ({ period: i + 1, subject: '-', teacher: '-' }))
      });
    }
  }
  return result;
});

function getSlotsForSectionAndDay(sec, grade, dayName) {
  const secAssignments = assignments.value.filter(a => Number(a.section_id) === Number(sec.id));
  
  const defaultSubjects = [
    { period: 1, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
    { period: 2, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
    { period: 3, subject: 'اللغة العربية', teacher: 'أ. سالم الفيتوري' },
    { period: 4, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
    { period: 5, subject: 'التربية الإسلامية', teacher: 'أ. سالم الفيتوري' },
    { period: 6, subject: 'الحاسوب والتقنية', teacher: 'أ. علي الحسن' }
  ];

  const dayShiftMap = { 'الأحد': 0, 'الإثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4 };
  const shift = (((sec.id || 1) * 2) + (dayShiftMap[dayName] || 0)) % 6;

  return [1, 2, 3, 4, 5, 6].map(period => {
    const defaultIdx = (period - 1 + shift) % defaultSubjects.length;
    const baseSlot = defaultSubjects[defaultIdx];
    
    const matchingAssign = secAssignments.find(a => a.subject_name === baseSlot.subject);
    const teacherName = matchingAssign ? matchingAssign.teacher_name : baseSlot.teacher;

    return {
      period,
      subject: baseSlot.subject,
      teacher: teacherName
    };
  });
}

const stats = ref({
  totalStudents: 0,
  totalTeachers: 0,
  totalSections: 0,
  totalTasks: 0
});

const students = ref([]);
const teachers = ref([]);
const assignments = ref([]);
const grades = ref([]);

const selectedStudent = ref(null);
const selectedTeacher = ref(null);
const teacherSearchQuery = ref('');

const filteredTeachers = computed(() => {
  if (!teacherSearchQuery.value) return teachers.value;
  const q = teacherSearchQuery.value.toLowerCase();
  return teachers.value.filter(t => 
    t.full_name?.toLowerCase().includes(q) ||
    t.username?.toLowerCase().includes(q)
  );
});

const teacherAssignments = computed(() => {
  if (!selectedTeacher.value) return [];
  return assignments.value.filter(a => Number(a.teacher_id) === Number(selectedTeacher.value.id));
});

function getTeacherAssignmentCount(teacherId) {
  return assignments.value.filter(a => Number(a.teacher_id) === Number(teacherId)).length;
}

function openTeacherDetail(t) {
  selectedTeacher.value = t;
  activeModule.value = 'teacher-details';
}

function openAssignForTeacher(t) {
  newAssign.teacher_id = t.id;
  showAddAssignModal.value = true;
}

const gradeStudents = computed(() => {
  if (!selectedGrade.value) return [];
  return students.value.filter(st => Number(st.grade_id) === Number(selectedGrade.value.id));
});

const gradeSections = computed(() => {
  if (!selectedGrade.value) return [];
  return selectedGrade.value.sections || [];
});

const gradeSubjects = computed(() => {
  if (!selectedGrade.value) return [];
  return selectedGrade.value.subjects || [];
});

function openGradeDetail(grade) {
  selectedGrade.value = grade;
  activeModule.value = 'grade-details';
}

const currentFormattedDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const dailyAnalytics = computed(() => {
  const sTotal = stats.value.totalStudents || 1450;
  const sRate = 96;
  const sPresent = Math.round(sTotal * (sRate / 100));
  const sAbsent = sTotal - sPresent;

  const tTotal = stats.value.totalTeachers || 42;
  const tRate = 95;
  const tPresent = Math.round(tTotal * (tRate / 100));
  const tAbsent = tTotal - tPresent;

  return {
    studentsTotal: sTotal,
    studentsPresent: sPresent,
    studentsAbsent: sAbsent,
    studentsRate: sRate,

    teachersTotal: tTotal,
    teachersPresent: tPresent,
    teachersAbsent: tAbsent,
    teachersRate: tRate,

    totalHomeworks: 28,
    activeHomeworks: 18,
    homeworkComplianceRate: 92,

    totalExams: 14,
    todayExams: 3,
    upcomingExams: 11
  };
});

const gradeAttendanceBreakdown = computed(() => {
  const rates = [98, 97, 96, 95, 97, 94, 96, 95, 98];
  return grades.value.map((g, idx) => {
    const baseCount = (g.sections && g.sections.length > 0 ? g.sections.length : 1) * 30;
    const rate = rates[idx % rates.length];
    const present = Math.round(baseCount * (rate / 100));
    const absent = baseCount - present;
    return {
      gradeName: g.name,
      level: g.level,
      rate,
      present,
      absent,
      total: baseCount
    };
  });
});

function printAnalyticsReport() {
  window.print();
}

const showTransferStudentModal = ref(false);
const showEditStudentModal = ref(false);

const studentSearchQuery = ref('');
const studentGradeFilter = ref('');
const studentSectionFilter = ref('');

const transferForm = reactive({
  student_id: '',
  grade_id: '',
  section_id: ''
});

const editStudentForm = reactive({
  id: '',
  full_name: '',
  roll_number: '',
  student_code: '',
  grade_id: '',
  section_id: ''
});

const filteredStudents = computed(() => {
  return students.value.filter(st => {
    const matchesSearch = !studentSearchQuery.value || 
      st.full_name?.toLowerCase().includes(studentSearchQuery.value.toLowerCase()) ||
      st.student_code?.toLowerCase().includes(studentSearchQuery.value.toLowerCase()) ||
      st.roll_number?.toString().includes(studentSearchQuery.value);

    const matchesGrade = !studentGradeFilter.value || Number(st.grade_id) === Number(studentGradeFilter.value);
    const matchesSection = !studentSectionFilter.value || Number(st.section_id) === Number(studentSectionFilter.value);

    return matchesSearch && matchesGrade && matchesSection;
  });
});

const availableSectionsForTransfer = computed(() => {
  if (!transferForm.grade_id) return [];
  const g = grades.value.find(gr => Number(gr.id) === Number(transferForm.grade_id));
  return g ? g.sections : [];
});

const availableSectionsForEdit = computed(() => {
  if (!editStudentForm.grade_id) return [];
  const g = grades.value.find(gr => Number(gr.id) === Number(editStudentForm.grade_id));
  return g ? g.sections : [];
});

const isDrawerOpen = ref(false);
const selectedTask = ref(null);

const isSectionDrawerOpen = ref(false);
const selectedSection = ref(null);
const selectedGrade = ref(null);
const activeSectionTab = ref('schedule'); // Default tab: الجدول الدراسي

const sectionStudents = computed(() => {
  if (!selectedSection.value) return [];
  return students.value.filter(st => Number(st.section_id) === Number(selectedSection.value.id));
});

const sectionTeachers = computed(() => {
  if (!selectedSection.value) return [];
  return assignments.value.filter(a => Number(a.section_id) === Number(selectedSection.value.id));
});

const sectionScheduleDays = computed(() => {
  return [
    {
      dayName: 'الأحد',
      slots: [
        { period: 1, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
        { period: 2, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
        { period: 3, subject: 'اللغة العربية', teacher: 'أ. سالم الفيتوري' },
        { period: 4, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
        { period: 5, subject: 'التربية الإسلامية', teacher: 'أ. سالم الفيتوري' },
        { period: 6, subject: 'الحاسوب', teacher: 'أ. علي الحسن' }
      ]
    },
    {
      dayName: 'الإثنين',
      slots: [
        { period: 1, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
        { period: 2, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
        { period: 3, subject: 'التربية الإسلامية', teacher: 'أ. سالم الفيتوري' },
        { period: 4, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
        { period: 5, subject: 'الدراسات الاجتماعية', teacher: 'أ. خالد سعيد' },
        { period: 6, subject: 'التربية البدنية', teacher: 'أ. محمود طه' }
      ]
    },
    {
      dayName: 'الثلاثاء',
      slots: [
        { period: 1, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
        { period: 2, subject: 'الحاسوب', teacher: 'أ. علي الحسن' },
        { period: 3, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
        { period: 4, subject: 'اللغة العربية', teacher: 'أ. سالم الفيتوري' },
        { period: 5, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
        { period: 6, subject: 'التربية الفنية', teacher: 'أ. سعاد النجار' }
      ]
    },
    {
      dayName: 'الأربعاء',
      slots: [
        { period: 1, subject: 'اللغة العربية', teacher: 'أ. سالم الفيتوري' },
        { period: 2, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
        { period: 3, subject: 'الدراسات الاجتماعية', teacher: 'أ. خالد سعيد' },
        { period: 4, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
        { period: 5, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
        { period: 6, subject: 'التربية الإسلامية', teacher: 'أ. سالم الفيتوري' }
      ]
    },
    {
      dayName: 'الخميس',
      slots: [
        { period: 1, subject: 'الرياضيات', teacher: 'أ. أحمد خالد' },
        { period: 2, subject: 'العلوم العامة', teacher: 'أ. محمد طارق' },
        { period: 3, subject: 'اللغة العربية', teacher: 'أ. سالم الفيتوري' },
        { period: 4, subject: 'اللغة الإنجليزية', teacher: 'أ. عمر السيد' },
        { period: 5, subject: 'الحاسوب', teacher: 'أ. علي الحسن' },
        { period: 6, subject: 'نشاط حر', teacher: 'أستاذ المادة' }
      ]
    }
  ];
});

function openSectionDetailModal(section, grade) {
  selectedSection.value = section;
  selectedGrade.value = grade;
  activeSectionTab.value = 'schedule'; // Default tab: الجدول الدراسي (الافتراضية)
  activeModule.value = 'section-details'; // Open as Full Page View!
}

const showAddStudentModal = ref(false);
const showAddTeacherModal = ref(false);
const showAddAssignModal = ref(false);
const showAddSectionModal = ref(false);
const showAddSubjectModal = ref(false);

const selectedGradeForModal = ref(null);

const newGradeForm = reactive({
  name: '',
  level: null
});

const newSectionForm = reactive({
  grade_id: '',
  name: ''
});

const newSubjectForm = reactive({
  grade_id: '',
  name: ''
});

const newStudent = reactive({
  full_name: '',
  roll_number: '',
  student_code: '',
  grade_id: '',
  section_id: ''
});

async function handleCreateGradeFromPage() {
  if (!newGradeForm.name || !newGradeForm.level) {
    alert('يرجى إدخال اسم الصف ورقم المستوى.');
    return;
  }
  try {
    const res = await api.post('/admin/grades', newGradeForm);
    if (res.data.success) {
      alert('✅ تم إضافة الفصل الدراسي بنجاح!');
      newGradeForm.name = '';
      newGradeForm.level = null;
      await fetchDashboardData();
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'حدث خطأ في إضافة الصف.');
  }
}

async function handleCreateSectionFromPage() {
  if (!newSectionForm.grade_id || !newSectionForm.name) {
    alert('يرجى اختيار الصف ورقم الشعبة.');
    return;
  }
  try {
    const res = await api.post('/admin/sections', newSectionForm);
    if (res.data.success) {
      alert('✅ تم إضافة الشعبة بنجاح!');
      newSectionForm.grade_id = '';
      newSectionForm.name = '';
      await fetchDashboardData();
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'حدث خطأ في إضافة الشعبة.');
  }
}

async function handleCreateSubjectFromPage() {
  if (!newSubjectForm.grade_id || !newSubjectForm.name) {
    alert('يرجى اختيار الصف واسم المادة.');
    return;
  }
  try {
    const res = await api.post('/admin/subjects', newSubjectForm);
    if (res.data.success) {
      alert('✅ تم إضافة المادة الدراسية بنجاح!');
      newSubjectForm.grade_id = '';
      newSubjectForm.name = '';
      await fetchDashboardData();
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'حدث خطأ في إضافة المادة.');
  }
}

const newTeacher = reactive({
  full_name: '',
  username: '',
  password: ''
});

const newAssign = reactive({
  teacher_id: '',
  grade_id: '',
  subject_id: '',
  section_id: ''
});

const newSectionName = ref('');
const newSubjectName = ref('');

const sampleTasks = [
  {
    id: 1,
    title: 'امتحان العلوم الشهري (فيزياء وكيمياء)',
    task_type: 'EXAM',
    subject_name: 'العلوم العامة',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    teacher_name: 'أ. أحمد خالد',
    due_date: '2026-08-16',
    description: 'اختبار تقييمي تحصيلي يغطي تجارب التبخر والدورة الحرارية.'
  },
  {
    id: 2,
    title: 'تمارين ص 45 (معادلات الجبر)',
    task_type: 'HOMEWORK',
    subject_name: 'الرياضيات',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    teacher_name: 'أ. أحمد خالد',
    due_date: '2026-08-16',
    description: 'حل تمارين معادلات الدرجة الأولى وتثبيت النتائج بالكراسة.'
  },
  {
    id: 3,
    title: 'إعراب سورة النبأ (الأيات 1-10)',
    task_type: 'HOMEWORK',
    subject_name: 'اللغة العربية',
    grade_name: 'الصف التاسع',
    section_name: '9ب',
    teacher_name: 'أ. سالم الفيتوري',
    due_date: '2026-08-19',
    description: 'استخراج الفاعل والمفعول به والقواعد الإعرابية المقررة.'
  },
  {
    id: 4,
    title: 'امتحان الرياضيات النصف سنوي',
    task_type: 'EXAM',
    subject_name: 'الرياضيات',
    grade_name: 'الصف الثامن',
    section_name: '8أ',
    teacher_name: 'أ. أحمد خالد',
    due_date: '2026-08-19',
    description: 'امتحان النصف سنوي الشامل لأسئلة الهندسية والجبر.'
  }
];

const activityLogs = [
  { id: 1, title: 'قام أ. أحمد خالد بنشر واجب رياضيات جديد للصف الثامن (8أ)', time: 'منذ 15 دقيقة', icon: '📚', typeClass: 'purple' },
  { id: 2, title: 'تم إدراج الطالب "عمر خالد" للصف الخامس الشعبة (5أ)', time: 'منذ ساعة واحدة', icon: '🎓', typeClass: 'emerald' },
  { id: 3, title: 'قام أ. سالم الفيتوري بجدولة امتحان اللغة العربية للصف التاسع (9ب)', time: 'منذ 3 ساعات', icon: '📝', typeClass: 'amber' },
  { id: 4, title: 'تم تحديث جدول التكليفات الأسبوعية لكادر المعلمين', time: 'اليوم 09:30 ص', icon: '⚙️', typeClass: 'indigo' }
];

const availableSectionsForNewStudent = computed(() => {
  if (!newStudent.grade_id) return [];
  const g = grades.value.find(gr => gr.id === Number(newStudent.grade_id));
  return g ? g.sections : [];
});

const availableSubjectsForAssign = computed(() => {
  if (!newAssign.grade_id) return [];
  const g = grades.value.find(gr => gr.id === Number(newAssign.grade_id));
  return g ? g.subjects : [];
});

const availableSectionsForAssign = computed(() => {
  if (!newAssign.grade_id) return [];
  const g = grades.value.find(gr => gr.id === Number(newAssign.grade_id));
  return g ? g.sections : [];
});

const groupedTasks = computed(() => {
  const groupsMap = {};
  sampleTasks.forEach(task => {
    const dateKey = task.due_date;
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
});

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

function getSubjectColorClass(name) {
  if (!name) return 'default';
  if (name.includes('رياضيات') || name.includes('إحصاء')) return 'math';
  if (name.includes('علوم') || name.includes('فيزياء') || name.includes('كيمياء')) return 'science';
  if (name.includes('عرب') || name.includes('نحو')) return 'arabic';
  if (name.includes('إنكليز') || name.includes('إنجليزية') || name.includes('English')) return 'english';
  return 'default';
}

function getSubjectIcon(name) {
  if (!name) return '📚';
  if (name.includes('رياضيات') || name.includes('إحصاء')) return '📐';
  if (name.includes('علوم') || name.includes('فيزياء') || name.includes('كيمياء')) return '🔬';
  if (name.includes('عرب') || name.includes('نحو')) return '📖';
  if (name.includes('إنكليز') || name.includes('إنجليزية') || name.includes('English')) return '🔤';
  if (name.includes('إسلامية') || name.includes('قرآن') || name.includes('تفسير')) return '🕌';
  return '📚';
}

function getTaskIcon(type) {
  return type === 'EXAM' ? '📝' : '📚';
}

function openTaskDrawer(task) {
  selectedTask.value = task;
  isDrawerOpen.value = true;
}

async function loadData() {
  loading.value = true;
  try {
    const [stRes, tcRes, asRes, grRes, sttRes] = await Promise.all([
      api.get('/admin/students'),
      api.get('/admin/teachers'),
      api.get('/admin/assignments'),
      api.get('/admin/grades'),
      api.get('/admin/stats')
    ]);

    if (stRes.data.success) students.value = stRes.data.data;
    if (tcRes.data.success) teachers.value = tcRes.data.data;
    if (asRes.data.success) assignments.value = asRes.data.data;
    if (grRes.data.success) grades.value = grRes.data.data;
    if (sttRes.data.success) stats.value = sttRes.data.stats || sttRes.data.data;
  } catch (err) {
    console.error('Failed to load admin DB data:', err);
  } finally {
    loading.value = false;
  }
}

function openStudentDetail(st) {
  selectedStudent.value = st;
  activeModule.value = 'student-details';
}

function openTransferStudentModal(st = null) {
  if (st) {
    transferForm.student_id = st.id;
    transferForm.grade_id = st.grade_id || '';
    transferForm.section_id = st.section_id || '';
  } else {
    transferForm.student_id = '';
    transferForm.grade_id = '';
    transferForm.section_id = '';
  }
  showTransferStudentModal.value = true;
}

function openEditStudentModal(st) {
  editStudentForm.id = st.id;
  editStudentForm.full_name = st.full_name || '';
  editStudentForm.roll_number = st.roll_number || '';
  editStudentForm.student_code = st.student_code || '';
  editStudentForm.grade_id = st.grade_id || '';
  editStudentForm.section_id = st.section_id || '';
  showEditStudentModal.value = true;
}

async function handleTransferStudent() {
  if (!transferForm.student_id || !transferForm.grade_id || !transferForm.section_id) {
    alert('يرجى اختيار الطالب، الصف الجديد، والشعبة الجديدة.');
    return;
  }

  const targetStudent = students.value.find(s => Number(s.id) === Number(transferForm.student_id));
  if (!targetStudent) return;

  try {
    const res = await api.put(`/admin/students/${transferForm.student_id}`, {
      full_name: targetStudent.full_name,
      roll_number: targetStudent.roll_number,
      student_code: targetStudent.student_code,
      grade_id: transferForm.grade_id,
      section_id: transferForm.section_id
    });

    if (res.data.success) {
      alert('✅ تم نقل الطالب إلى الفصل والشعبة الجديدة بنجاح!');
      showTransferStudentModal.value = false;
      await loadData();
      if (selectedStudent.value && selectedStudent.value.id === targetStudent.id) {
        const updated = students.value.find(s => s.id === targetStudent.id);
        if (updated) selectedStudent.value = updated;
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'حدث خطأ أثناء نقل الطالب.');
  }
}

async function handleUpdateStudent() {
  if (!editStudentForm.id || !editStudentForm.full_name || !editStudentForm.roll_number || !editStudentForm.student_code) {
    alert('يرجى تعبئة كامل بيانات الطالب.');
    return;
  }

  try {
    const res = await api.put(`/admin/students/${editStudentForm.id}`, editStudentForm);
    if (res.data.success) {
      alert('✅ تم تحديث بيانات الطالب بنجاح!');
      showEditStudentModal.value = false;
      await loadData();
      if (selectedStudent.value && selectedStudent.value.id === editStudentForm.id) {
        const updated = students.value.find(s => s.id === editStudentForm.id);
        if (updated) selectedStudent.value = updated;
      }
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || 'حدث خطأ أثناء تحديث بيانات الطالب.');
  }
}

async function handleAddStudent() {
  try {
    await api.post('/admin/students', newStudent);
    showAddStudentModal.value = false;
    newStudent.full_name = '';
    newStudent.roll_number = '';
    newStudent.student_code = '';
    await loadData();
  } catch (err) {
    alert('فشل إضافة الطالب. تأكد من رقم الجلوس والكود.');
  }
}

async function handleDeleteStudent(id) {
  if (!confirm('هل أنت تأكد من رغبتك في حذف هذا الطالب؟')) return;
  try {
    await api.delete(`/admin/students/${id}`);
    await loadData();
    if (selectedStudent.value && selectedStudent.value.id === id) {
      selectedStudent.value = null;
      activeModule.value = 'students';
    }
  } catch (err) {
    alert('فشل حذف الطالب.');
  }
}

async function handleAddTeacher() {
  try {
    await api.post('/admin/teachers', newTeacher);
    showAddTeacherModal.value = false;
    newTeacher.full_name = '';
    newTeacher.username = '';
    newTeacher.password = '';
    await loadData();
  } catch (err) {
    alert('فشل إضافة معلم. اسم المستخدم مستخدم مسبقاً.');
  }
}

async function handleDeleteTeacher(id) {
  if (!confirm('هل أنت تأكد من رغبتك في حذف المعلم؟')) return;
  try {
    await api.delete(`/admin/teachers/${id}`);
    await loadData();
    if (selectedTeacher.value && selectedTeacher.value.id === id) {
      selectedTeacher.value = null;
      activeModule.value = 'teachers';
    }
  } catch (err) {
    alert('فشل حذف المعلم.');
  }
}

async function handleAddAssign() {
  try {
    await api.post('/admin/assignments', newAssign);
    showAddAssignModal.value = false;
    await loadData();
  } catch (err) {
    alert('فشل التكليف.');
  }
}

async function handleDeleteAssign(id) {
  if (!confirm('هل أنت تأكد من إزالة التكليف؟')) return;
  try {
    await api.delete(`/admin/assignments/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل حذف التكليف.');
  }
}

function openAddSectionModal(grade) {
  selectedGradeForModal.value = grade;
  newSectionName.value = '';
  showAddSectionModal.value = true;
}

async function handleAddSection() {
  if (!selectedGradeForModal.value || !newSectionName.value) return;
  try {
    await api.post('/admin/sections', {
      grade_id: selectedGradeForModal.value.id,
      name: newSectionName.value
    });
    showAddSectionModal.value = false;
    await loadData();
  } catch (err) {
    alert('فشل إضافة الشعبة.');
  }
}

async function handleDeleteSection(id) {
  if (!confirm('هل أنت تأكد من حذف الشعبة؟')) return;
  try {
    await api.delete(`/admin/sections/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل حذف الشعبة.');
  }
}

function openAddSubjectModal(grade) {
  selectedGradeForModal.value = grade;
  newSubjectName.value = '';
  showAddSubjectModal.value = true;
}

async function handleAddSubject() {
  if (!selectedGradeForModal.value || !newSubjectName.value) return;
  try {
    await api.post('/admin/subjects', {
      grade_id: selectedGradeForModal.value.id,
      name: newSubjectName.value
    });
    showAddSubjectModal.value = false;
    await loadData();
  } catch (err) {
    alert('فشل إضافة المادة.');
  }
}

async function handleDeleteSubject(id) {
  if (!confirm('هل أنت تأكد من حذف المادة؟')) return;
  try {
    await api.delete(`/admin/subjects/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل حذف المادة.');
  }
}

function handleLogout() {
  localStorage.removeItem('school_token');
  localStorage.removeItem('school_user');
  router.push('/login');
}

onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
/* ===== DESKTOP ADMIN LAYOUT SYSTEM ===== */
.desktop-admin-root {
  background: #f1f5f9;
  min-height: 100vh;
  width: 100%;
  color: #0f172a;
  direction: rtl;
  font-family: 'SF Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* DESKTOP TOP EXECUTIVE HEADER */
.desktop-admin-header {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);
}

.brand-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.brand-subtitle {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

/* DESKTOP PILL NAVIGATION */
.desktop-nav-pills {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 6px;
  border-radius: 40px;
}

.desktop-pill-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 30px;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.desktop-pill-btn.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);
}

.desktop-pill-btn:hover:not(.active) {
  background: #e2e8f0;
  color: #0f172a;
}

/* HEADER CONTROLS */
.header-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.desktop-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 20px;
  width: 260px;
  color: #64748b;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: 12px;
  color: #0f172a;
  width: 100%;
}

.admin-user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 30px;
}

.avatar-box {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.user-meta {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
}

.user-role {
  font-size: 10px;
  color: #64748b;
}

.logout-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
}

/* DESKTOP MAIN WRAPPER */
.desktop-main-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 36px 60px 36px;
}

.desktop-loading-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  font-weight: 700;
  color: #4f46e5;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

/* DESKTOP KPI GRID */
.desktop-kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 24px;
}

.kpi-desktop-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
}

.kpi-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.kpi-desktop-card.purple .kpi-icon-circle { background: #f3e8ff; }
.kpi-desktop-card.indigo .kpi-icon-circle { background: #e0e7ff; }
.kpi-desktop-card.emerald .kpi-icon-circle { background: #dcfce7; }
.kpi-desktop-card.amber .kpi-icon-circle { background: #fef3c7; }

.kpi-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-label-text {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.kpi-value-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.kpi-big-num {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
}

.badge-status {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 12px;
}

.badge-status.success { background: #dcfce7; color: #15803d; }
.badge-status.info { background: #e0e7ff; color: #4338ca; }
.badge-status.neutral { background: #f1f5f9; color: #475569; }
.badge-status.warning { background: #fef3c7; color: #b45309; }

/* DESKTOP CONTENT GRID (2fr | 1fr) */
.desktop-content-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 24px;
}

.desktop-content-left, .desktop-content-right {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.desktop-card-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.04);
}

.card-box-title {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.card-box-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.tag-pill-primary {
  background: #e0e7ff;
  color: #4338ca;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 14px;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-actions-gap {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* DESKTOP TABLES */
.desktop-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 18px;
}

.desktop-table th {
  text-align: right;
  font-size: 12px;
  font-weight: 800;
  color: #475569;
  padding: 14px 16px;
  border-bottom: 1px solid #cbd5e1;
  background: #f8fafc;
}

.desktop-table td {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.table-btn-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.desktop-primary-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.25);
}

.desktop-secondary-btn {
  background: #ffffff;
  color: #4338ca;
  border: 1px solid #c7d2fe;
  padding: 10px 18px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  cursor: pointer;
}

.desktop-teachers-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 18px;
}

.col-box-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

/* WIDGET CARDS RIGHT */
.widget-card {
  padding: 20px;
}

.widget-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.widget-title.light {
  color: #ffffff;
}

.quick-actions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  cursor: pointer;
  text-align: right;
  transition: all 0.2s ease;
  width: 100%;
}

.quick-action-btn:hover {
  background: #ffffff;
  border-color: #c7d2fe;
  box-shadow: 0 4px 14px rgba(67, 56, 202, 0.1);
}

.qa-icon {
  font-size: 20px;
}

.qa-text {
  display: flex;
  flex-direction: column;
}

.qa-main {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.qa-sub {
  font-size: 11px;
  color: #64748b;
}

.dot-live-badge {
  background: #dcfce7;
  color: #15803d;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 10px;
}

.activity-feed-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
}

.activity-feed-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}

.feed-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.feed-icon.purple { background: #f3e8ff; }
.feed-icon.emerald { background: #dcfce7; }
.feed-icon.amber { background: #fef3c7; }
.feed-icon.indigo { background: #e0e7ff; }

.feed-body {
  display: flex;
  flex-direction: column;
}

.feed-text {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.feed-time {
  font-size: 10px;
  color: #64748b;
}

.info-gradient-card {
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  color: #ffffff;
}

.system-meta-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 14px;
}

.meta-row-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.meta-lbl {
  color: #c7d2fe;
}

.meta-val {
  font-weight: 800;
}

.meta-val.success {
  color: #4ade80;
}

/* 3D SQUIRCLE STRUCTURE MODIFIED FOR DESKTOP */
.add-mini-pill-btn {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.add-mini-pill-btn.primary {
  background: #4f46e5;
  color: #ffffff;
  border: none;
}

.sections-pills-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 16px 0;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 14px;
  flex-wrap: wrap;
}

.sections-row-label {
  font-size: 12px;
  font-weight: 800;
  color: #334155;
}

.sections-pills-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.sec-pill-tag {
  background: #ffffff;
  color: #0f172a;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sec-pill-tag.subject {
  background: #eef2ff;
  color: #3730a3;
  border-color: #c7d2fe;
}

.sched-subject-squircle.section-card-only {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  min-height: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.bold-sec-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.sched-icon-box.class-icon {
  background: #e0e7ff;
  color: #4338ca;
}

.remove-pill-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
}

.remove-pill-btn:hover {
  color: #ef4444;
}

.squircle-footer-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
}

.delete-sub-icon-btn {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exam-ref-grid.grid-3-cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 12px;
}

.sched-subject-squircle.section-click {
  cursor: pointer;
  transition: all 0.2s ease;
}

.sched-subject-squircle.section-click:hover {
  transform: translateY(-2px);
  border-color: #6366f1;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.12);
}

.sec-drawer-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 6px;
  border-radius: 16px;
  margin-bottom: 20px;
}

.sec-tab-btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.sec-tab-btn.active {
  background: #0f172a;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

.sec-body-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 14px;
}

.drawer-sched-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.drawer-sched-day {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.day-label-badge {
  font-size: 12px;
  font-weight: 800;
  color: #4338ca;
  background: #e0e7ff;
  padding: 4px 10px;
  border-radius: 8px;
  align-self: flex-start;
}

.day-slots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.slot-card-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.slot-period-tag {
  font-size: 10px;
  color: #64748b;
}

.slot-sub-title {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
}

.slot-tech-name {
  font-size: 11px;
  color: #475569;
}

.back-to-structure-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.back-to-structure-btn:hover {
  background: #0f172a;
  color: #ffffff;
}

.sec-title-meta {
  display: flex;
  flex-direction: column;
}

.full-page-sec-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 8px;
  border-radius: 20px;
  margin: 20px 0;
}

.full-sec-tab-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 14px;
  border: none;
  background: transparent;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.full-sec-tab-btn.active {
  background: #4f46e5;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.25);
}

.full-tab-body {
  margin-top: 16px;
}

.body-header-margin {
  margin-bottom: 16px;
}

.schedule-table-wrapper {
  width: 100%;
  overflow-x: auto;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
}

.desktop-schedule-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
}

.desktop-schedule-table th {
  background: #f8fafc;
  border-bottom: 2px solid #cbd5e1;
  border-left: 1px solid #e2e8f0;
  padding: 14px 10px;
  text-align: center;
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.day-col-header {
  width: 130px;
  background: #e0e7ff !important;
  color: #4338ca !important;
}

.period-col-header {
  background: #f8fafc;
}

.desktop-schedule-table td {
  border-bottom: 1px solid #f1f5f9;
  border-left: 1px solid #f1f5f9;
  padding: 10px 8px;
  text-align: center;
}

.day-name-cell {
  background: #f8fafc;
  font-size: 13px;
  font-weight: 800;
  color: #4338ca;
  width: 130px;
}

.period-slot-cell {
  vertical-align: middle;
}

.slot-cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 8px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.slot-cell-content:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
}

.slot-sub-text {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
}

.slot-teacher-text {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

.structure-master-table td {
  padding: 16px;
  vertical-align: middle;
}

.grade-badge-flex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.grade-level-pill {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 13px;
  box-shadow: 0 2px 8px rgba(67, 56, 202, 0.15);
}

.grade-title-text {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.table-items-flex {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.clickable-sec-pill {
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  transition: all 0.2s ease;
}

.clickable-sec-pill:hover {
  background: #0f172a;
  color: #ffffff;
  border-color: #0f172a;
}

.clickable-sec-pill:hover .remove-pill-btn {
  color: #f87171;
}

.table-actions-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* CREATION MODULE STYLES */
.creation-forms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.creation-form-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.creation-form-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: #94a3b8;
}

.creation-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.creation-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.creation-icon.purple { background: #f3e8ff; color: #7e22ce; }
.creation-icon.emerald { background: #d1fae5; color: #047857; }
.creation-icon.indigo { background: #e0e7ff; color: #4338ca; }
.creation-icon.amber { background: #fef3c7; color: #b45309; }
.creation-icon.teal { background: #ccfbf1; color: #0f766e; }

.creation-card-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.creation-card-desc {
  font-size: 11px;
  color: #64748b;
  margin: 2px 0 0 0;
}

.creation-form-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.creation-submit-btn {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 12px 18px;
  border-radius: 14px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.2s ease;
}

.creation-submit-btn:hover {
  background: #4f46e5;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
}

/* FORM MODALS */
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

/* DAY SWITCHER & MASTER DAILY SCHEDULE STYLES */
.day-switcher-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.day-bar-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.day-pill-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  color: #475569;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-pill-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.day-pill-btn.active {
  background: #6366f1;
  color: #ffffff;
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
}

.section-label-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  padding: 10px 14px !important;
}

.section-label-cell .grade-text {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.section-label-cell .sec-text {
  font-size: 11px;
  color: #6366f1;
  font-weight: 700;
  background: #eef2ff;
  padding: 2px 8px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
}

.small-btn {
  padding: 6px 12px;
  font-size: 12px;
}

/* CLICKABLE STUDENT ROWS & STUDENT PROFILE STYLES */
.clickable-student-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.clickable-student-row:hover {
  background: #f1f5f9 !important;
}

.clickable-name {
  color: #4f46e5;
  font-weight: 700;
  cursor: pointer;
}

.clickable-name:hover {
  text-decoration: underline;
}

.table-actions-inline {
  display: flex;
  gap: 6px;
  align-items: center;
}

.table-btn-secondary {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-btn-secondary:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.profile-hero-banner {
  display: flex;
  align-items: center;
  gap: 20px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  padding: 24px;
  border-radius: 16px;
  color: #ffffff;
  margin-bottom: 24px;
}

.profile-avatar-big {
  font-size: 44px;
  width: 76px;
  height: 76px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.profile-student-name {
  font-size: 22px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.profile-badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 12px;
}

.profile-badge.purple { background: #ede9fe; color: #6d28d9; }
.profile-badge.indigo { background: #e0e7ff; color: #3730a3; }
.profile-badge.emerald { background: #d1fae5; color: #065f46; }

.profile-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-card-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
}

.info-card-title {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 16px 0;
  padding-bottom: 10px;
  border-bottom: 1px dashed #cbd5e1;
}

.info-details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.info-lbl {
  color: #64748b;
  font-weight: 600;
}

.info-val {
  color: #0f172a;
}

/* DAILY ANALYTICS MODULE STYLES */
.analytics-metric-card {
  padding: 16px;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.purple-border { border-top: 4px solid #8b5cf6; }
.indigo-border { border-top: 4px solid #6366f1; }
.emerald-border { border-top: 4px solid #10b981; }
.amber-border { border-top: 4px solid #f59e0b; }

.metric-card-header {
  margin-bottom: 8px;
}

.metric-title {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
}

.metric-big-val {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

.metric-sub-unit {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.metric-bar-wrapper {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.4s ease;
}

.metric-bar-fill.emerald { background: #10b981; }
.metric-bar-fill.indigo { background: #6366f1; }
.metric-bar-fill.purple { background: #8b5cf6; }
.metric-bar-fill.amber { background: #f59e0b; }

.metric-footer-row {
  font-size: 12px;
  font-weight: 700;
}

.metric-stat.success { color: #059669; }
.metric-stat.danger { color: #dc2626; }
.metric-stat.warning { color: #d97706; }
.metric-stat.info { color: #2563eb; }
.metric-stat.neutral { color: #64748b; }
</style>
