<template>
  <div class="vue-gantt-sidebar">
    <div class="vue-gantt-sidebar__header" :class="{ 'vue-gantt-sidebar__header--two-row': useTwoRowHeaders }">
      {{ title }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  useTwoRowHeaders?: boolean
}>()
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
</style>
