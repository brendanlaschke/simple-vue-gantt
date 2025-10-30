<template>
  <g v-if="showGrid" class="grid-lines">
    <line
      v-for="column in columns"
      :key="`grid-${column.date.getTime()}`"
      :x1="column.x"
      :y1="0"
      :x2="column.x"
      :y2="chartHeight"
      :stroke="gridColor"
      stroke-width="1"
    />
  </g>
</template>

<script setup lang="ts">
import type { TimeColumn } from '@/types'

interface Props {
  columns: TimeColumn[]
  chartHeight: number
  gridColor?: string
  showGrid?: boolean
}

withDefaults(defineProps<Props>(), {
  gridColor: '#e5e7eb',
  showGrid: true
})
</script>
