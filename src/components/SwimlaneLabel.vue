<template>
  <div 
    class="swimlane-label"
    :style="{
      height: `${height}px`,
      top: `${top}px`,
      backgroundColor: color || '#f3f4f6'
    }"
  >
    <span class="swimlane-label__text">{{ name }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  height: number
  top: number
  color?: string
}

defineProps<Props>()
</script>

<style scoped>
.swimlane-label {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  box-sizing: border-box;
}

.swimlane-label__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
