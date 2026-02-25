<template>
  <div class="milestone-header-row" :style="{ width: `${chartWidth}px`, height: `${height}px` }">
    <svg :width="chartWidth" :height="height" class="milestone-header-row__svg">
      <g
        v-for="milestone in milestones"
        :key="milestone.id"
        class="milestone-header-item"
        @click="handleClick($event, milestone.id)"
      >
        <!-- Milestone Diamond -->
        <path
          :d="getMilestonePath(milestone.x, height / 2)"
          :fill="milestone.color || '#f59e0b'"
          :stroke="milestone.color || '#f59e0b'"
          stroke-width="2"
          class="milestone-header-item__diamond"
        />

        <!-- Milestone Label -->
        <text
          v-if="showLabel"
          :x="milestone.x"
          :y="height / 2 + milestoneSize + 12"
          text-anchor="middle"
          class="milestone-header-item__label"
          fill="#374151"
          font-size="11"
          font-weight="500"
        >
          {{ milestone.name }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { RenderedMilestone } from "@/types";

interface Props {
  milestones: RenderedMilestone[];
  chartWidth: number;
  milestoneSize: number;
  height?: number;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: 40,
  showLabel: true,
});

const emit = defineEmits<{
  click: [event: MouseEvent, milestoneId: string];
}>();

const handleClick = (event: MouseEvent, milestoneId: string) => {
  emit("click", event, milestoneId);
};

const getMilestonePath = (x: number, y: number) => {
  const size = props.milestoneSize;
  const halfSize = size / 2;

  // Create a diamond shape centered at (x, y)
  return `
    M ${x},${y - halfSize}
    L ${x + halfSize},${y}
    L ${x},${y + halfSize}
    L ${x - halfSize},${y}
    Z
  `;
};
</script>

<style scoped>
.milestone-header-row {
  position: relative;
  background: #fef3c7;
  border-bottom: 2px solid #f59e0b;
  overflow: hidden;
}

.milestone-header-row__svg {
  display: block;
}

.milestone-header-item {
  cursor: pointer;
  transition: opacity 0.2s;
}

.milestone-header-item:hover {
  opacity: 0.8;
}

.milestone-header-item__diamond {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.milestone-header-item__label {
  pointer-events: none;
  user-select: none;
}
</style>
