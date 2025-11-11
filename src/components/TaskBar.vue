<template>
  <g 
    class="task-bar-group" 
    :class="{ 
      'task-bar-group--dragging': isDragging,
      'task-bar-group--movable': editPosition,
    }"
  >
    <title v-if="showTooltips">{{ task.name }}</title>
    
    <!-- Task Background -->
    <rect
      :x="displayX"
      :y="task.y"
      :width="displayWidth"
      :height="barHeight"
      :fill="task.color || '#3b82f6'"
      :opacity="0.3"
      rx="4"
      class="task-bar-group__background"
      @mousedown="startDrag($event, 'move')"
      @click="handleClick"
    />
    
    <!-- Task Progress -->
    <rect
      :x="displayX"
      :y="task.y"
      :width="displayWidth * (task.progress / 100)"
      :height="barHeight"
      :fill="task.color || '#3b82f6'"
      rx="4"
      class="task-bar-group__progress"
      @mousedown="startDrag($event, 'move')"
      @click="handleClick"
    />

    <!-- Task Label -->
    <clipPath :id="`clip-${task.id}`">
      <rect
        :x="displayX"
        :y="task.y"
        :width="displayWidth - 16"
        :height="barHeight"
      />
    </clipPath>
    <text
      :x="displayX + 8"
      :y="task.y + barHeight / 2"
      dominant-baseline="middle"
      class="task-bar-group__label"
      fill="white"
      font-size="12"
      font-weight="500"
      :clip-path="`url(#clip-${task.id})`"
    >
      <tspan>{{ task.name }}</tspan>
      <tspan v-if="showProgress"> - {{ task.progress }}%</tspan>
    </text>

    <!-- Left Resize Handle -->
    <rect
      v-if="!isDragging && editDuration"
      :x="displayX - 4"
      :y="task.y"
      :width="8"
      :height="barHeight"
      fill="transparent"
      class="task-bar-group__resize-handle task-bar-group__resize-handle--left"
      @mousedown.stop="startDrag($event, 'resize-left')"
    />

    <!-- Right Resize Handle -->
    <rect
      v-if="!isDragging && editDuration"
      :x="displayX + displayWidth - 4"
      :y="task.y"
      :width="8"
      :height="barHeight"
      fill="transparent"
      class="task-bar-group__resize-handle task-bar-group__resize-handle--right"
      @mousedown.stop="startDrag($event, 'resize-right')"
    />
  </g>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RenderedTask } from '@/types'

interface Props {
  task: RenderedTask
  barHeight: number
  columnWidth: number
  chartStartDate: Date
  viewMode: string
  editDuration?: boolean
  editPosition?: boolean
  showProgress?: boolean
  showTooltips?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editDuration: false,
  editPosition: false,
  showProgress: false,
  showTooltips: true
})

const emit = defineEmits<{
  'update:task': [taskId: string, updates: { start?: Date; end?: Date }]
  'click': [event: MouseEvent, taskId: string]
}>()

const isDragging = ref(false)
const dragType = ref<'move' | 'resize-left' | 'resize-right' | null>(null)
const dragStartX = ref(0)
const tempX = ref(0)
const tempWidth = ref(0)

const displayX = computed(() => isDragging.value ? tempX.value : props.task.x)
const displayWidth = computed(() => isDragging.value ? tempWidth.value : props.task.width)

const handleClick = (event: MouseEvent) => {
  // Don't emit click if we're dragging
  if (isDragging.value) return
  emit('click', event, props.task.id)
}

const startDrag = (event: MouseEvent, type: 'move' | 'resize-left' | 'resize-right') => {
  // Check permissions based on drag type
  if (type === 'move' && !props.editPosition) return
  if ((type === 'resize-left' || type === 'resize-right') && !props.editDuration) return
  
  event.preventDefault()
  event.stopPropagation()
  
  isDragging.value = true
  dragType.value = type
  dragStartX.value = event.clientX
  tempX.value = props.task.x
  tempWidth.value = props.task.width

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    
    const deltaX = e.clientX - dragStartX.value
    
    if (dragType.value === 'move') {
      tempX.value = props.task.x + deltaX
    } else if (dragType.value === 'resize-left') {
      const newX = props.task.x + deltaX
      const newWidth = props.task.width - deltaX
      if (newWidth >= props.columnWidth) {
        tempX.value = newX
        tempWidth.value = newWidth
      }
    } else if (dragType.value === 'resize-right') {
      const newWidth = props.task.width + deltaX
      if (newWidth >= props.columnWidth) {
        tempWidth.value = newWidth
      }
    }
  }

  const onMouseUp = () => {
    if (!isDragging.value) return
    
    // Calculate new dates based on final position
    const updates = calculateDateUpdates()
    
    if (updates.start || updates.end) {
      emit('update:task', props.task.id, updates)
    }
    
    isDragging.value = false
    dragType.value = null
    
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const calculateDateUpdates = () => {
  const updates: { start?: Date; end?: Date } = {}
  
  if (dragType.value === 'move') {
    // Calculate offset in days/columns
    const offsetX = tempX.value - props.task.x
    const offsetColumns = Math.round(offsetX / props.columnWidth)
    
    if (offsetColumns !== 0) {
      const offsetMs = getOffsetMilliseconds(offsetColumns)
      updates.start = new Date(props.task.start.getTime() + offsetMs)
      updates.end = new Date(props.task.end.getTime() + offsetMs)
    }
  } else if (dragType.value === 'resize-left') {
    const offsetX = tempX.value - props.task.x
    const offsetColumns = Math.round(offsetX / props.columnWidth)
    
    if (offsetColumns !== 0) {
      const offsetMs = getOffsetMilliseconds(offsetColumns)
      updates.start = new Date(props.task.start.getTime() + offsetMs)
    }
  } else if (dragType.value === 'resize-right') {
    const widthDiff = tempWidth.value - props.task.width
    const offsetColumns = Math.round(widthDiff / props.columnWidth)
    
    if (offsetColumns !== 0) {
      const offsetMs = getOffsetMilliseconds(offsetColumns)
      updates.end = new Date(props.task.end.getTime() + offsetMs)
    }
  }
  
  return updates
}

const getOffsetMilliseconds = (columns: number): number => {
  const mode = props.viewMode || 'day'
  
  switch (mode) {
    case 'hour':
      return columns * 60 * 60 * 1000
    case 'day':
      return columns * 24 * 60 * 60 * 1000
    case 'week':
      return columns * 7 * 24 * 60 * 60 * 1000
    case 'month':
      // Approximate - 30 days
      return columns * 30 * 24 * 60 * 60 * 1000
    case 'year':
      // Approximate - 365 days
      return columns * 365 * 24 * 60 * 60 * 1000
    default:
      return columns * 24 * 60 * 60 * 1000
  }
}
</script>

<style scoped>
.task-bar-group {
  transition: opacity 0.2s;
}

.task-bar-group--movable {
  cursor: move;
}

.task-bar-group:hover {
  opacity: 0.8;
}

.task-bar-group--dragging {
  opacity: 0.7;
}

.task-bar-group__background {
  transition: all 0.2s;
}

.task-bar-group__progress {
  transition: all 0.2s;
}

.task-bar-group__label {
  pointer-events: none;
  user-select: none;
}

.task-bar-group__resize-handle {
  cursor: ew-resize;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-bar-group:hover .task-bar-group__resize-handle {
  opacity: 1;
}

.task-bar-group__resize-handle--left:hover,
.task-bar-group__resize-handle--right:hover {
  fill: rgba(59, 130, 246, 0.3);
}
</style>
