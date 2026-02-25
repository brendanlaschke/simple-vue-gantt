<template>
  <div
    class="swimlane-label"
    :style="{
      height: `${height}px`,
      top: `${top}px`,
      backgroundColor: color || '#f3f4f6',
    }"
    @click="$emit('click')"
  >
    <span class="swimlane-label__text">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string;
  height: number;
  top: number;
  color?: string;
}

defineProps<Props>();
defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.swimlane-label {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s;
}

.swimlane-label:hover {
  filter: brightness(0.95);
}

.swimlane-label__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
