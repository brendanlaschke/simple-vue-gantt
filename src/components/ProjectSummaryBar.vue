<template>
  <g class="project-summary-bar">
    <rect
      :x="x"
      :y="y + height / 2 - barHeight / 2"
      :width="width"
      :height="barHeight"
      :fill="color"
      :opacity="0.3"
      :rx="4"
      :ry="4"
      class="project-summary-bar__background"
    />
    <rect
      :x="x"
      :y="y + height / 2 - barHeight / 2"
      :width="width"
      :height="barHeight"
      fill="none"
      :stroke="color"
      :stroke-width="2"
      :rx="4"
      :ry="4"
      class="project-summary-bar__border"
    />
  </g>
</template>

<script setup lang="ts">
interface Props {
  x: number
  y: number
  width: number
  height: number
  barHeight?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  barHeight: 8,
  color: '#3b82f6'
})
</script>

<style scoped>
.project-summary-bar__background {
  transition: opacity 0.2s;
}

.project-summary-bar:hover .project-summary-bar__background {
  opacity: 0.5;
}
</style>
