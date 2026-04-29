<template>
  <div class="vue-gantt-sidebar">
    <div
      class="vue-gantt-sidebar__header"
      :class="{ 'vue-gantt-sidebar__header--two-row': useTwoRowHeaders }"
    >
      <span class="vue-gantt-sidebar__title">{{ title }}</span>
      <button
        v-if="showCollapseExpandAll"
        class="vue-gantt-sidebar__collapse-btn"
        :title="areAllExpanded ? 'Collapse all' : 'Expand all'"
        @click="areAllExpanded ? emit('collapse-all') : emit('expand-all')"
      >
        {{ areAllExpanded ? "⊟" : "⊞" }}
      </button>
    </div>
    <!-- Milestone Header Spacer -->
    <div
      v-if="showMilestoneHeaderSpacer"
      class="vue-gantt-sidebar__milestone-spacer"
      :style="{ height: `${milestoneHeaderHeight}px` }"
    >
      <span class="vue-gantt-sidebar__milestone-label">Milestones</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  useTwoRowHeaders?: boolean;
  showMilestoneHeaderSpacer?: boolean;
  milestoneHeaderHeight?: number;
  showCollapseExpandAll?: boolean;
  areAllExpanded?: boolean;
}>();

const emit = defineEmits<{
  "collapse-all": [];
  "expand-all": [];
}>();
</script>

<style scoped>
.vue-gantt-sidebar {
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  min-width: 200px;
}

.vue-gantt-sidebar__header {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f3f4f6;
  position: sticky;
  top: 0;
  z-index: 10;
  gap: 6px;
}

.vue-gantt-sidebar__header--two-row {
  height: 80px;
}

.vue-gantt-sidebar__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vue-gantt-sidebar__collapse-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px 4px;
  color: #6b7280;
  border-radius: 4px;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.vue-gantt-sidebar__collapse-btn:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.vue-gantt-sidebar__milestone-spacer {
  display: flex;
  align-items: center;
  padding: 0 12px;
  background-color: #fef3c7;
  border-bottom: 2px solid #f59e0b;
  border-right: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
}

.vue-gantt-sidebar__milestone-label {
  display: block;
}
</style>
