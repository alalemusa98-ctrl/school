<template>
  <div class="teacher-dashboard">
    <AppNavbar />

    <main class="container page-content">
      <div class="header-section">
        <div>
          <h2>👨‍🏫 لوحة تحكم المعلم</h2>
          <p>إضافة وإدارة الواجبات والامتحانات والحلول النموذجية لشعبك</p>
        </div>
        <BaseButton variant="primary" @click="showCreateModal = true">
          ➕ إضافة واجب أو امتحان جديد
        </BaseButton>
      </div>

      <!-- Assignments Summary Cards -->
      <div class="assignments-section">
        <h3>المواد والشعب المكلف بتدريسها:</h3>
        <div class="assignments-grid">
          <BaseCard v-for="assign in assignments" :key="assign.assignment_id" class="assignment-card">
            <div class="assign-grade">{{ assign.grade_name }} — الشعبة ({{ assign.section_name }})</div>
            <div class="assign-subject">📖 {{ assign.subject_name }}</div>
          </BaseCard>
        </div>
      </div>

      <!-- Created Tasks List -->
      <div class="tasks-section">
        <h3>الواجبات والامتحانات المنشورة سابقاً:</h3>

        <div v-if="loadingTasks" class="loading-state">جاري تحميل المهام... ⏳</div>
        <div v-else-if="tasks.length === 0" class="empty-state">
          لم تقم بإضافة أي واجبات أو امتحانات بعد. اضغط على زر "إضافة جديد" أعلاه للإدراج.
        </div>
        <div v-else class="teacher-tasks-list">
          <BaseCard v-for="task in tasks" :key="task.id" class="teacher-task-card">
            <div class="task-header">
              <div class="task-badges">
                <BaseBadge :type="task.task_type === 'EXAM' ? 'exam' : 'homework'">
                  {{ task.task_type === 'EXAM' ? 'امتحان' : 'واجب مدرسي' }}
                </BaseBadge>
                <span class="sec-badge">{{ task.grade_name }} ({{ task.section_name }}) — {{ task.subject_name }}</span>
              </div>
              <BaseButton variant="danger" size="sm" @click="handleDeleteTask(task.id)">
                🗑️ حذف
              </BaseButton>
            </div>

            <h4 class="task-title">{{ task.title }}</h4>
            <p class="task-desc" v-if="task.description">{{ task.description }}</p>

            <div class="solution-preview" v-if="task.has_solution">
              <span>✅ الحل النموذجي:</span>
              <p v-if="task.solution_text">{{ task.solution_text }}</p>
              <a v-if="task.solution_attachment_path" :href="task.solution_attachment_path" target="_blank">📄 مرفق الحل</a>
            </div>
          </BaseCard>
        </div>
      </div>

      <!-- Create Task Modal -->
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal-card animate-fade-in">
          <div class="modal-header">
            <h3>➕ إضافة مهمة تعليمية جديدة</h3>
            <button class="close-btn" @click="showCreateModal = false">✖</button>
          </div>

          <form @submit.prevent="handleCreateTask" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label>نوع المهمة *</label>
                <select v-model="newTask.task_type" required class="form-control">
                  <option value="HOMEWORK">📚 واجب مدرسي</option>
                  <option value="EXAM">📝 امتحان / ورقة عمل</option>
                </select>
              </div>

              <div class="form-group">
                <label>التكليف (المادة والشعبة) *</label>
                <select v-model="selectedAssignment" required class="form-control" @change="onAssignmentChange">
                  <option value="" disabled>اختر المادة والشعبة...</option>
                  <option v-for="a in assignments" :key="a.assignment_id" :value="a">
                    {{ a.grade_name }} ({{ a.section_name }}) — {{ a.subject_name }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>عنوان المهمة *</label>
              <input type="text" v-model="newTask.title" placeholder="مثال: تمارين صفحة 15" required class="form-control" />
            </div>

            <div class="form-group">
              <label>الوصف أو التعليمات النصية</label>
              <textarea v-model="newTask.description" rows="3" placeholder="اكتب التفاصيل هنا..." class="form-control"></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>تاريخ التسليم المتوقع</label>
                <input type="date" v-model="newTask.due_date" class="form-control" />
              </div>

              <div class="form-group">
                <label>مرفق الواجب/الامتحان (PDF / صورة)</label>
                <input type="file" @change="e => newTask.attachment = e.target.files[0]" class="form-control" />
              </div>
            </div>

            <!-- Solution Switch -->
            <div class="solution-toggle-box">
              <label class="checkbox-label">
                <input type="checkbox" v-model="newTask.has_solution" />
                <span>إرفاق حل نموذجي مسبقاً (يظهر للطالب زر عرض الحل)</span>
              </label>

              <div v-if="newTask.has_solution" class="solution-inputs">
                <div class="form-group">
                  <label>نص الحل النموذجي</label>
                  <textarea v-model="newTask.solution_text" rows="2" placeholder="أدخل خطوات أو الإجابة النموذجية..." class="form-control"></textarea>
                </div>
                <div class="form-group">
                  <label>مرفق ملف الحل النموذجي</label>
                  <input type="file" @change="e => newTask.solution_attachment = e.target.files[0]" class="form-control" />
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <BaseButton variant="primary" block size="lg" :loading="submitting" type="submit">
                حفظ ونشر المهمة 🚀
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import AppNavbar from '../../components/common/AppNavbar.vue';
import BaseCard from '../../components/common/BaseCard.vue';
import BaseButton from '../../components/common/BaseButton.vue';
import BaseBadge from '../../components/common/BaseBadge.vue';
import api from '../../services/api';

const assignments = ref([]);
const tasks = ref([]);
const loadingTasks = ref(true);
const showCreateModal = ref(false);
const submitting = ref(false);

const selectedAssignment = ref(null);

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

function onAssignmentChange() {
  if (selectedAssignment.value) {
    newTask.subject_id = selectedAssignment.value.subject_id;
    newTask.section_id = selectedAssignment.value.section_id;
  }
}

async function loadData() {
  loadingTasks.value = true;
  try {
    const [assignRes, tasksRes] = await Promise.all([
      api.get('/teacher/assignments'),
      api.get('/teacher/tasks')
    ]);
    if (assignRes.data.success) assignments.value = assignRes.data.data;
    if (tasksRes.data.success) tasks.value = tasksRes.data.data;
  } catch (err) {
    console.error('Failed to load teacher data:', err);
  } finally {
    loadingTasks.value = false;
  }
}

async function handleCreateTask() {
  if (!newTask.subject_id || !newTask.section_id) {
    alert('يرجى اختيار التكليف الخاص بالمادة والشعبة.');
    return;
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
    if (newTask.solution_attachment) formData.append('solution_attachment', newTask.solution_attachment);

    const res = await api.post('/teacher/tasks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.success) {
      showCreateModal.value = false;
      resetForm();
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'حدث خطأ أثناء حفظ المهمة.');
  } finally {
    submitting.value = false;
  }
}

async function handleDeleteTask(id) {
  if (!confirm('هل أنت تأكد من رغبتك في حذف هذه المهمة؟')) return;
  try {
    const res = await api.delete(`/teacher/tasks/${id}`);
    if (res.data.success) {
      await loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || 'فشل حذف المهمة.');
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
  newTask.solution_attachment = null;
  selectedAssignment.value = null;
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.page-content {
  padding-top: 28px;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-section h2 {
  font-size: 1.8rem;
  font-weight: 800;
}

.header-section p {
  color: var(--text-muted);
}

.assignments-section {
  margin-bottom: 40px;
}

.assignments-section h3, .tasks-section h3 {
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.assignment-card {
  border: 2px solid #e0e7ff;
  background: #f8fafc;
}

.assign-grade {
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.assign-subject {
  font-size: 1.05rem;
  font-weight: 700;
}

.teacher-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.teacher-task-card {
  border: 2px solid #e2e8f0;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sec-badge {
  font-weight: 700;
  font-size: 0.9rem;
  color: #475569;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 12px;
}

.task-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.solution-preview {
  margin-top: 12px;
  background: #ecfdf5;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  border-right: 4px solid #10b981;
  font-size: 0.9rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 600px;
  border-radius: var(--radius-lg);
  padding: 28px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-light);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 700;
  font-size: 0.9rem;
}

.form-control {
  font-family: inherit;
  font-size: 1rem;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-light);
  outline: none;
}

.solution-toggle-box {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  padding: 16px;
  border-radius: var(--radius-md);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  cursor: pointer;
}

.solution-inputs {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
