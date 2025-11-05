<template>
  <div
    class="project-header"
    :style="{ height: `${height}px`, top: `${top}px` }"
    @click="$emit('toggle')"
  >
    <span class="project-header__toggle">
      {{ isExpanded ? '▼' : '▶' }}
    </span>
    <span class="project-header__name">{{ name }}</span>
    <span class="project-header__count">({{ taskCount }})</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  height: number
  top: number
  isExpanded: boolean
  taskCount: number
}

defineProps<Props>()
defineEmits<{
  toggle: []
}>()
</script>

<style scoped>
.project-header {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  background: #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.project-header:hover {
  background: #e5e7eb;
}

.project-header__toggle {
  margin-right: 8px;
  font-size: 10px;
  width: 12px;
  display: inline-block;
}

.project-header__name {
  flex: 1;
}

.project-header__count {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 8px;
}
</style>
