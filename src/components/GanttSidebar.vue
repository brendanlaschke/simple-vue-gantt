<template>
  <div class="vue-gantt-sidebar">
    <div
      class="vue-gantt-sidebar__header"
      :class="{ 'vue-gantt-sidebar__header--two-row': useTwoRowHeaders }"
    >
      {{ title }}
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
}

.vue-gantt-sidebar__header--two-row {
  height: 80px;
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
