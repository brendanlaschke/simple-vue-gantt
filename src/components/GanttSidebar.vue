<template>
  <div class="gantt-sidebar">
    <div 
      class="gantt-sidebar__header"
      :class="{ 'gantt-sidebar__header--two-rows': useTwoRowHeaders }"
    >
      {{ title }}
    </div>
    <div class="gantt-sidebar__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  useTwoRowHeaders?: boolean
}

withDefaults(defineProps<Props>(), {
  useTwoRowHeaders: false
})
</script>

<style scoped>
.gantt-sidebar {
  position: sticky;
  left: 0;
  z-index: 10;
  background: white;
  border-right: 1px solid #e5e7eb;
  min-width: 200px;
  flex-shrink: 0;
}

.gantt-sidebar__header {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: 600;
  border-bottom: 2px solid #e5e7eb;
  background: #f9fafb;
}

.gantt-sidebar__header--two-rows {
  height: 80px;
}

.gantt-sidebar__content {
  padding: 8px 0;
}
</style>
