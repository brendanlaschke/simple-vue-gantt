<template>
  <div
    class="task-name"
    :class="{ 'task-name--grouped': isGrouped }"
    :style="{ height: `${height}px`, marginBottom: `${marginBottom}px` }"
    :title="showTooltips ? name : undefined"
  >
    {{ name }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  height: number
  marginBottom: number
  isGrouped?: boolean
  showTooltips?: boolean
}

withDefaults(defineProps<Props>(), {
  isGrouped: false,
  showTooltips: false
})
</script>

<style scoped>
.task-name {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-name--grouped {
  padding-left: 32px;
}
</style>
