<template>
  <g class="milestone-group">
    <!-- Milestone Diamond -->
    <path
      :d="getMilestonePath(milestone.x, milestone.y + barHeight / 2)"
      :fill="milestone.color || '#f59e0b'"
      :stroke="milestone.color || '#f59e0b'"
      stroke-width="2"
      class="milestone-group__diamond"
    />
    
    <!-- Milestone Label -->
    <text
      v-if="showLabel"
      :x="milestone.x"
      :y="milestone.y + barHeight / 2 + milestoneSize + 12"
      text-anchor="middle"
      class="milestone-group__label"
      fill="#374151"
      font-size="11"
      font-weight="500"
    >
      {{ milestone.name }}
    </text>
  </g>
</template>

<script setup lang="ts">
import type { RenderedMilestone } from '@/types'

interface Props {
  milestone: RenderedMilestone
  barHeight: number
  milestoneSize: number
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true
})

const getMilestonePath = (x: number, y: number) => {
  const halfSize = props.milestoneSize / 2
  return `M ${x},${y - halfSize} L ${x + halfSize},${y} L ${x},${y + halfSize} L ${x - halfSize},${y} Z`
}
</script>

<style scoped>
.milestone-group {
  cursor: pointer;
  transition: opacity 0.2s;
}

.milestone-group:hover {
  opacity: 0.85;
}

.milestone-group__diamond {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  transition: all 0.2s;
}

.milestone-group__diamond:hover {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.milestone-group__label {
  pointer-events: none;
  user-select: none;
}
</style>
