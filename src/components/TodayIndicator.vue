<template>
  <g v-if="showToday && todayX !== null" class="today-indicator">
    <line
      :x1="todayX"
      :y1="0"
      :x2="todayX"
      :y2="chartHeight"
      :stroke="todayColor"
      stroke-width="2"
      stroke-dasharray="4,4"
    />
  </g>
</template>

<script setup lang="ts">
interface Props {
  todayX: number | null
  chartHeight: number
  todayColor?: string
  showToday?: boolean
}

withDefaults(defineProps<Props>(), {
  todayColor: '#ef4444',
  showToday: true
})
</script>
