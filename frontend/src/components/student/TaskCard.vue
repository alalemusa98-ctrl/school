<template>
  <BaseCard 
    :variant="task.task_type === 'EXAM' ? 'exam' : 'homework'" 
    class="task-card animate-fade-in"
  >
    <template #header>
      <div class="task-meta">
        <BaseBadge :type="task.task_type === 'EXAM' ? 'exam' : 'homework'">
          {{ task.task_type === 'EXAM' ? '📝 امتحان' : '📚 واجب مدرسي' }}
        </BaseBadge>
        <span class="subject-tag">📖 {{ task.subject_name }}</span>
      </div>
      <div class="teacher-name">👨‍🏫 {{ task.teacher_name }}</div>
    </template>

    <div class="task-content">
      <h3 class="task-title">{{ task.title }}</h3>
      <p class="task-desc" v-if="task.description">{{ task.description }}</p>

      <div class="task-attachments" v-if="task.attachment_path">
        <a :href="task.attachment_path" target="_blank" class="attachment-link">
          📎 تحميل ملف {{ task.task_type === 'EXAM' ? 'الامتحان' : 'الواجب' }}
        </a>
      </div>

      <!-- Solution Section -->
      <div class="solution-box" v-if="task.has_solution">
        <div class="solution-header">
          <BaseBadge type="solution">✅ الحل النموذجي متوفر</BaseBadge>
        </div>
        
        <div class="solution-content" v-if="showSolution">
          <p class="solution-text" v-if="task.solution_text">{{ task.solution_text }}</p>
          <a v-if="task.solution_attachment_path" :href="task.solution_attachment_path" target="_blank" class="solution-file-link">
            📄 تحميل ملف الحل النموذجي
          </a>
        </div>

        <BaseButton 
          v-else 
          variant="success" 
          size="sm" 
          class="solution-btn" 
          @click="showSolution = true"
        >
          💡 عرض الحل النموذجي
        </BaseButton>
      </div>
    </div>

    <template #footer>
      <div class="due-date" v-if="task.due_date">
        <span>⏰ تاريخ التسليم:</span>
        <strong>{{ formatDate(task.due_date) }}</strong>
      </div>
      <div class="created-at">
        <span>تاريخ النشر: {{ formatDate(task.created_at) }}</span>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue';
import BaseCard from '../common/BaseCard.vue';
import BaseBadge from '../common/BaseBadge.vue';
import BaseButton from '../common/BaseButton.vue';

defineProps({
  task: { type: Object, required: true }
});

const showSolution = ref(false);

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-LY', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.task-card {
  margin-bottom: 20px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subject-tag {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--primary-color);
  background: #f0fdf4;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
}

.teacher-name {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
}

.task-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 8px;
}

.task-desc {
  font-size: 1rem;
  color: #475569;
  white-space: pre-line;
  margin-bottom: 16px;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border-right: 4px solid var(--primary-light);
}

.attachment-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  border: 1px solid #bfdbfe;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.attachment-link:hover {
  background: #dbeafe;
}

.solution-box {
  background: var(--accent-solution-bg);
  border: 2px dashed #6ee7b7;
  padding: 16px;
  border-radius: var(--radius-md);
  margin-top: 16px;
}

.solution-header {
  margin-bottom: 10px;
}

.solution-btn {
  margin-top: 8px;
}

.solution-content {
  margin-top: 12px;
  animation: fadeIn 0.25s ease-in;
}

.solution-text {
  font-weight: 600;
  color: #065f46;
  margin-bottom: 8px;
  white-space: pre-line;
}

.solution-file-link {
  display: inline-block;
  color: #047857;
  font-weight: 700;
  text-decoration: underline;
}

.due-date {
  font-size: 0.9rem;
  color: #b45309;
}

.created-at {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
