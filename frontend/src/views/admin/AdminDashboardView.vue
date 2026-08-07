<template>
  <div class="admin-dashboard">
    <AppNavbar />

    <main class="container page-content">
      <div class="header-section">
        <h2>⚙️ لوحة التحكم الإدارية الشاملة</h2>
        <p>إدارة الهيكل التعليمي، الطلاب، المعلمين، وتوزيع جدول الحصص الأسبوعي</p>
      </div>

      <!-- Stats Grid Cards -->
      <div class="stats-grid">
        <BaseCard class="stat-card">
          <div class="stat-icon">🎓</div>
          <div class="stat-val">{{ stats.totalStudents || 0 }}</div>
          <div class="stat-lbl">إجمالي الطلاب</div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-val">{{ stats.totalTeachers || 0 }}</div>
          <div class="stat-lbl">إجمالي المعلمين</div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-icon">🏫</div>
          <div class="stat-val">{{ stats.totalSections || 0 }}</div>
          <div class="stat-lbl">الشعب الدراسية</div>
        </BaseCard>

        <BaseCard class="stat-card">
          <div class="stat-icon">📑</div>
          <div class="stat-val">{{ stats.totalTasks || 0 }}</div>
          <div class="stat-lbl">الواجبات والامتحانات</div>
        </BaseCard>
      </div>

      <!-- Navigation Tabs for Admin Modules -->
      <div class="admin-modules-selector">
        <button 
          v-for="m in modules" 
          :key="m.id" 
          class="module-btn" 
          :class="{ active: activeModule === m.id }"
          @click="activeModule = m.id"
        >
          {{ m.icon }} {{ m.name }}
        </button>
      </div>

      <!-- 1. Students Module -->
      <div v-if="activeModule === 'students'" class="module-content animate-fade-in">
        <div class="content-header">
          <h3>🎓 قائمة الطلاب المسجلين</h3>
          <BaseButton variant="primary" size="sm" @click="showAddStudentModal = true">
            ➕ إضافة طالب جديد
          </BaseButton>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>رقم الجلوس</th>
              <th>كود الطالب</th>
              <th>الاسم الكامل</th>
              <th>الصف</th>
              <th>الشعبة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="st in students" :key="st.id">
              <td><strong>{{ st.roll_number }}</strong></td>
              <td><code>{{ st.student_code }}</code></td>
              <td>{{ st.full_name }}</td>
              <td>{{ st.grade_name }}</td>
              <td>{{ st.section_name }}</td>
              <td>
                <button class="btn-danger-sm" @click="handleDeleteStudent(st.id)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 2. Teachers Module -->
      <div v-if="activeModule === 'teachers'" class="module-content animate-fade-in">
        <div class="content-header">
          <h3>👨‍🏫 قائمة حسابات المعلمين والتكليفات</h3>
          <div class="action-buttons">
            <BaseButton variant="outline" size="sm" @click="showAddAssignModal = true">
              🔗 تكليف معلم بالمادة والشعبة
            </BaseButton>
            <BaseButton variant="primary" size="sm" @click="showAddTeacherModal = true">
              ➕ إضافة معلم جديد
            </BaseButton>
          </div>
        </div>

        <div class="teachers-split">
          <div class="teachers-table-wrapper">
            <h4>الحسابات:</h4>
            <table class="data-table">
              <thead>
                <tr>
                  <th>الاسم الكامل</th>
                  <th>اسم المستخدم</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in teachers" :key="t.id">
                  <td><strong>{{ t.full_name }}</strong></td>
                  <td><code>{{ t.username }}</code></td>
                  <td>
                    <button class="btn-danger-sm" @click="handleDeleteTeacher(t.id)">حذف</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="assignments-table-wrapper">
            <h4>جدول التكليفات الحالية:</h4>
            <table class="data-table">
              <thead>
                <tr>
                  <th>المعلم</th>
                  <th>المادة</th>
                  <th>الصف والشعبة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in assignments" :key="a.id">
                  <td>{{ a.teacher_name }}</td>
                  <td>{{ a.subject_name }}</td>
                  <td>{{ a.grade_name }} ({{ a.section_name }})</td>
                  <td>
                    <button class="btn-danger-sm" @click="handleDeleteAssign(a.id)">إزالة</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 3. Structure Module (Grades, Sections, Subjects) -->
      <div v-if="activeModule === 'structure'" class="module-content animate-fade-in">
        <div class="content-header">
          <h3>🏫 الهيكل التعليمي (الصفوف 1 - 9) والشعب والمواد</h3>
        </div>

        <div class="grades-accordion">
          <div v-for="g in grades" :key="g.id" class="grade-box">
            <div class="grade-title">
              <h4>{{ g.name }} (مستوى {{ g.level }})</h4>
            </div>

            <div class="grade-details">
              <div class="details-col">
                <div class="col-header">
                  <span>الشعب/القاعات:</span>
                  <button class="add-mini-btn" @click="openAddSectionModal(g)">+ إضافة شعبة</button>
                </div>
                <div class="items-tags">
                  <span v-for="sec in g.sections" :key="sec.id" class="item-tag">
                    {{ sec.name }}
                    <button @click="handleDeleteSection(sec.id)">×</button>
                  </span>
                </div>
              </div>

              <div class="details-col">
                <div class="col-header">
                  <span>المواد الدراسية:</span>
                  <button class="add-mini-btn" @click="openAddSubjectModal(g)">+ إضافة مادة</button>
                </div>
                <div class="items-tags">
                  <span v-for="sub in g.subjects" :key="sub.id" class="item-tag subject">
                    📖 {{ sub.name }}
                    <button @click="handleDeleteSubject(sub.id)">×</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Add Student Modal -->
      <div v-if="showAddStudentModal" class="modal-overlay" @click.self="showAddStudentModal = false">
        <div class="modal-card animate-fade-in">
          <h3>➕ إضافة طالب جديد</h3>
          <form @submit.prevent="handleAddStudent" class="modal-form">
            <div class="form-group">
              <label>الاسم الكامل *</label>
              <input type="text" v-model="newStudent.full_name" required class="form-control" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>رقم الجلوس *</label>
                <input type="text" v-model="newStudent.roll_number" placeholder="مثال: 1002" required class="form-control" />
              </div>
              <div class="form-group">
                <label>كود الطالب *</label>
                <input type="text" v-model="newStudent.student_code" placeholder="مثال: ST1002" required class="form-control" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>الصف الدراسي *</label>
                <select v-model="newStudent.grade_id" required class="form-control">
                  <option value="" disabled>اختر الصف...</option>
                  <option v-for="g in grades" :key="g.id" :value="g.id">{{ g.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>الشعبة *</label>
                <select v-model="newStudent.section_id" required class="form-control">
                  <option value="" disabled>اختر الشعبة...</option>
                  <option v-for="sec in availableSectionsForNewStudent" :key="sec.id" :value="sec.id">
                    {{ sec.name }}
                  </option>
                </select>
              </div>
            </div>
            <BaseButton variant="primary" block type="submit">إدراج الطالب 🚀</BaseButton>
          </form>
        </div>
      </div>

      <!-- Add Teacher Modal -->
      <div v-if="showAddTeacherModal" class="modal-overlay" @click.self="showAddTeacherModal = false">
        <div class="modal-card animate-fade-in">
          <h3>➕ إضافة حساب معلم جديد</h3>
          <form @submit.prevent="handleAddTeacher" class="modal-form">
            <div class="form-group">
              <label>الاسم الكامل للمعلم *</label>
              <input type="text" v-model="newTeacher.full_name" required class="form-control" />
            </div>
            <div class="form-group">
              <label>اسم المستخدم (Username) *</label>
              <input type="text" v-model="newTeacher.username" placeholder="teacher2" required class="form-control" />
            </div>
            <div class="form-group">
              <label>كلمة المرور *</label>
              <input type="password" v-model="newTeacher.password" required class="form-control" />
            </div>
            <BaseButton variant="primary" block type="submit">إنشاء الحساب 🔑</BaseButton>
          </form>
        </div>
      </div>

      <!-- Assign Teacher Modal -->
      <div v-if="showAddAssignModal" class="modal-overlay" @click.self="showAddAssignModal = false">
        <div class="modal-card animate-fade-in">
          <h3>🔗 تكليف معلم بمادة وشعبة</h3>
          <form @submit.prevent="handleAddAssign" class="modal-form">
            <div class="form-group">
              <label>اختر المعلم *</label>
              <select v-model="newAssign.teacher_id" required class="form-control">
                <option value="" disabled>اختر...</option>
                <option v-for="t in teachers" :key="t.id" :value="t.id">{{ t.full_name }} ({{ t.username }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>اختر الصف *</label>
              <select v-model="selectedGradeForAssign" required class="form-control">
                <option value="" disabled>اختر الصف...</option>
                <option v-for="g in grades" :key="g.id" :value="g">{{ g.name }}</option>
              </select>
            </div>
            <div class="form-row" v-if="selectedGradeForAssign">
              <div class="form-group">
                <label>الشعبة *</label>
                <select v-model="newAssign.section_id" required class="form-control">
                  <option value="" disabled>اختر الشعبة...</option>
                  <option v-for="sec in selectedGradeForAssign.sections" :key="sec.id" :value="sec.id">{{ sec.name }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>المادة *</label>
                <select v-model="newAssign.subject_id" required class="form-control">
                  <option value="" disabled>اختر المادة...</option>
                  <option v-for="sub in selectedGradeForAssign.subjects" :key="sub.id" :value="sub.id">{{ sub.name }}</option>
                </select>
              </div>
            </div>
            <BaseButton variant="primary" block type="submit">تأكيد التكليف 🔗</BaseButton>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import api from '../../services/api';

const stats = ref({});
const activeModule = ref('students');

const modules = [
  { id: 'students', name: 'الطلاب والجلوس', icon: '🎓' },
  { id: 'teachers', name: 'المعلمون والتكليفات', icon: '👨‍🏫' },
  { id: 'structure', name: 'الصفوف والشعب والمواد', icon: '🏫' }
];

const students = ref([]);
const teachers = ref([]);
const assignments = ref([]);
const grades = ref([]);

const showAddStudentModal = ref(false);
const showAddTeacherModal = ref(false);
const showAddAssignModal = ref(false);

const selectedGradeForAssign = ref(null);

const newStudent = reactive({
  full_name: '',
  roll_number: '',
  student_code: '',
  grade_id: '',
  section_id: ''
});

const newTeacher = reactive({
  full_name: '',
  username: '',
  password: ''
});

const newAssign = reactive({
  teacher_id: '',
  subject_id: '',
  section_id: ''
});

const availableSectionsForNewStudent = computed(() => {
  if (!newStudent.grade_id) return [];
  const g = grades.value.find(item => item.id === newStudent.grade_id);
  return g ? g.sections : [];
});

async function loadData() {
  try {
    const [statsRes, stRes, tRes, aRes, gRes] = await Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/students'),
      api.get('/admin/teachers'),
      api.get('/admin/assignments'),
      api.get('/admin/grades')
    ]);

    if (statsRes.data.success) stats.value = statsRes.data.stats;
    if (stRes.data.success) students.value = stRes.data.data;
    if (tRes.data.success) teachers.value = tRes.data.data;
    if (aRes.data.success) assignments.value = aRes.data.data;
    if (gRes.data.success) grades.value = gRes.data.data;
  } catch (err) {
    console.error('Failed to load admin data:', err);
  }
}

async function handleAddStudent() {
  try {
    const res = await api.post('/admin/students', newStudent);
    if (res.data.success) {
      showAddStudentModal.value = false;
      newStudent.full_name = ''; newStudent.roll_number = ''; newStudent.student_code = '';
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'فشل إضافة الطالب.');
  }
}

async function handleDeleteStudent(id) {
  if (!confirm('تأكيد حذف الطالب؟')) return;
  try {
    await api.delete(`/admin/students/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل الحذف.');
  }
}

async function handleAddTeacher() {
  try {
    const res = await api.post('/admin/teachers', newTeacher);
    if (res.data.success) {
      showAddTeacherModal.value = false;
      newTeacher.full_name = ''; newTeacher.username = ''; newTeacher.password = '';
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'فشل إنشاء المعلم.');
  }
}

async function handleDeleteTeacher(id) {
  if (!confirm('تأكيد حذف حساب المعلم؟')) return;
  try {
    await api.delete(`/admin/teachers/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل الحذف.');
  }
}

async function handleAddAssign() {
  try {
    const res = await api.post('/admin/assignments', newAssign);
    if (res.data.success) {
      showAddAssignModal.value = false;
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'فشل إضافة التكليف.');
  }
}

async function handleDeleteAssign(id) {
  if (!confirm('تأكيد إزالة التكليف؟')) return;
  try {
    await api.delete(`/admin/assignments/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل الإزالة.');
  }
}

async function openAddSectionModal(grade) {
  const name = prompt(`أدخل اسم الشعبة الجديدة لـ ${grade.name} (مثال: 5ج):`);
  if (name) {
    try {
      await api.post('/admin/sections', { grade_id: grade.id, name });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل إضافة الشعبة.');
    }
  }
}

async function handleDeleteSection(id) {
  if (!confirm('تأكيد حذف الشعبة؟ سيتم حذف طلابها ومجموعاتها مرتبطة بها.')) return;
  try {
    await api.delete(`/admin/sections/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل الحذف.');
  }
}

async function openAddSubjectModal(grade) {
  const name = prompt(`أدخل اسم المادة الجديدة لـ ${grade.name} (مثال: التاريخ):`);
  if (name) {
    try {
      await api.post('/admin/subjects', { grade_id: grade.id, name });
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل إضافة المادة.');
    }
  }
}

async function handleDeleteSubject(id) {
  if (!confirm('تأكيد حذف المادة؟')) return;
  try {
    await api.delete(`/admin/subjects/${id}`);
    await loadData();
  } catch (err) {
    alert('فشل الحذف.');
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-content {
  padding-top: 28px;
  padding-bottom: 40px;
}

.header-section {
  margin-bottom: 28px;
}

.header-section h2 {
  font-size: 1.8rem;
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  text-align: center;
  border: 2px solid #e0e7ff;
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 6px;
}

.stat-val {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
}

.stat-lbl {
  font-size: 0.9rem;
  color: var(--text-muted);
  font-weight: 700;
}

.admin-modules-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

.module-btn {
  font-family: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  background: #f1f5f9;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s;
}

.module-btn.active {
  background: var(--primary-gradient);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.module-content {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 2px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.data-table th, .data-table td {
  padding: 12px 16px;
  text-align: right;
  border-bottom: 1px solid var(--border-light);
}

.data-table th {
  background: #f8fafc;
  font-weight: 800;
  color: var(--text-main);
}

.btn-danger-sm {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 4px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.85rem;
}

.teachers-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.grades-accordion {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.grade-box {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.grade-title h4 {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 12px;
}

.grade-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 8px;
}

.add-mini-btn {
  background: #e0e7ff;
  color: var(--primary-color);
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.8rem;
}

.items-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.item-tag {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.item-tag.subject {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #047857;
}

.item-tag button {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 800;
  cursor: pointer;
  font-size: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-lg);
  padding: 24px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
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

.form-control {
  font-family: inherit;
  font-size: 0.95rem;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-light);
}
</style>
