<template>
  <div class="timeline-header" :class="{ 'timeline-header--two-rows': useTwoRowHeaders }">
    <!-- Two-row timeline -->
    <template v-if="useTwoRowHeaders">
      <!-- Primary row (larger time units) -->
      <div class="timeline-header__row timeline-header__row--primary">
        <div
          v-for="(period, index) in primaryPeriods"
          :key="`primary-${index}`"
          class="timeline-header__column timeline-header__column--primary"
          :style="{
            width: `${period.width}px`,
            left: `${period.x}px`
          }"
        >
          {{ period.label }}
        </div>
      </div>
      <!-- Secondary row (smaller time units) -->
      <div class="timeline-header__row timeline-header__row--secondary">
        <div
          v-for="column in columns"
          :key="column.date.getTime()"
          class="timeline-header__column timeline-header__column--secondary"
          :style="{
            width: `${columnWidth}px`,
            left: `${column.x}px`
          }"
        >
          {{ column.secondaryLabel }}
        </div>
      </div>
    </template>

    <!-- Single row timeline -->
    <template v-else>
      <div
        v-for="column in columns"
        :key="column.date.getTime()"
        class="timeline-header__column"
        :style="{
          width: `${columnWidth}px`,
          left: `${column.x}px`
        }"
      >
        {{ column.label }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TimeColumn } from '@/types'

interface PrimaryPeriod {
  label: string
  x: number
  width: number
}

interface Props {
  columns: TimeColumn[]
  columnWidth: number
  primaryPeriods?: PrimaryPeriod[]
  useTwoRowHeaders?: boolean
}

withDefaults(defineProps<Props>(), {
  primaryPeriods: () => [],
  useTwoRowHeaders: false
})
</script>

<style scoped>
.timeline-header {
  position: relative;
  height: 40px;
  border-bottom: 2px solid #e5e7eb;
  background: #f9fafb;
}

.timeline-header--two-rows {
  height: 80px;
  display: flex;
  flex-direction: column;
}

.timeline-header__row {
  position: relative;
  flex: 1;
}

.timeline-header__row--primary {
  border-bottom: 1px solid #e5e7eb;
}

.timeline-header__column {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  border-right: 1px solid #e5e7eb;
}

.timeline-header__column--primary {
  font-weight: 600;
  color: #374151;
  background: #f3f4f6;
}

.timeline-header__column--secondary {
  font-size: 11px;
}
</style>
