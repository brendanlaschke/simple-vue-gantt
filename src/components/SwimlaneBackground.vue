<template>
  <rect
    :x="0"
    :y="y"
    :width="chartWidth"
    :height="height"
    :fill="color"
    class="swimlane-background"
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
  color: '#ffffff'
})
</script>

<style scoped>
.swimlane-background {
  opacity: 0.6;
}
</style>
