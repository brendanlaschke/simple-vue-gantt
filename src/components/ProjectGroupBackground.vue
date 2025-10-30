<template>
  <rect
    :x="0"
    :y="y"
    :width="chartWidth"
    :height="height"
    :fill="color"
    class="project-group-background"
  />
</template>

<script setup lang="ts">
interface Props {
  y: number
  height: number
  chartWidth: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: '#f9fafb'
})
</script>

<style scoped>
.project-group-background {
  opacity: 0.8;
}
</style>
