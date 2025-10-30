<template>
  <div class="vue-gantt">
    <div class="vue-gantt__container">
      <!-- Sidebar with Task Names -->
      <GanttSidebar 
        :title="enableSwimlanes && enableProjectGrouping ? 'Projects & Swim Lanes' : (enableSwimlanes ? 'Swim Lanes' : (enableProjectGrouping ? 'Projects & Tasks' : 'Tasks'))"
        :use-two-row-headers="useTwoRowHeaders"
      >
        <!-- Project Grouping + Swim Lane Mode -->
        <template v-if="enableSwimlanes && enableProjectGrouping">
          <template v-for="project in renderedProjects" :key="project.id">
            <!-- Project Header -->
            <ProjectHeader
              :name="project.name"
              :height="projectHeaderHeight"
              :top="project.y"
              :is-expanded="project.isExpanded"
              :task-count="project.taskCount"
              @toggle="toggleProject(project.id)"
            />
            
            <!-- Swimlanes within this project -->
            <template v-if="project.isExpanded">
              <SwimlaneLabel
                v-for="swimlane in swimlanesForProject(project.id)"
                :key="swimlane.id"
                :name="swimlane.name"
                :height="swimlane.height"
                :top="swimlane.y"
                :color="swimlane.color"
              />
            </template>
          </template>

          <!-- Orphan swimlanes (no project) -->
          <SwimlaneLabel
            v-for="swimlane in orphanSwimlanes"
            :key="swimlane.id"
            :name="swimlane.name"
            :height="swimlane.height"
            :top="swimlane.y"
            :color="swimlane.color"
          />
        </template>

        <!-- Swim Lane Mode (without project grouping) -->
        <template v-else-if="enableSwimlanes">
          <SwimlaneLabel
            v-for="swimlane in renderedSwimlanes"
            :key="swimlane.id"
            :name="swimlane.name"
            :height="swimlane.height"
            :top="swimlane.y"
            :color="swimlane.color"
          />
        </template>

        <!-- Project Grouping Mode (without swim lanes) -->
        <template v-else-if="enableProjectGrouping">
          <template v-for="project in renderedProjects" :key="project.id">
            <!-- Project Header -->
            <ProjectHeader
              :name="project.name"
              :height="projectHeaderHeight"
              :top="project.y"
              :is-expanded="project.isExpanded"
              :task-count="project.taskCount"
              @toggle="toggleProject(project.id)"
            />
            
            <!-- Project Tasks -->
            <template v-if="project.isExpanded">
              <TaskName
                v-for="task in tasksForProject(project.id)"
                :key="task.id"
                :name="task.name"
                :height="barHeight"
                :margin-bottom="barPadding"
                :is-grouped="true"
              />
            </template>
          </template>

          <!-- Orphan Tasks (no project) -->
          <TaskName
            v-for="task in orphanTasks"
            :key="task.id"
            :name="task.name"
            :height="barHeight"
            :margin-bottom="barPadding"
          />
        </template>

        <!-- Simple Mode (No Grouping) -->
        <template v-else>
          <TaskName
            v-for="task in tasks"
            :key="task.id"
            :name="task.name"
            :height="barHeight"
            :margin-bottom="barPadding"
          />
        </template>
      </GanttSidebar>

      <!-- Chart Area -->
      <div class="vue-gantt__chart-container">
        <!-- Timeline Header -->
        <TimelineHeader
          :columns="timeColumns"
          :column-width="columnWidth"
          :primary-periods="primaryPeriods"
          :use-two-row-headers="useTwoRowHeaders"
        />

        <!-- Chart SVG -->
        <div class="vue-gantt__chart" :style="{ width: `${chartWidth}px` }">
          <svg
            :width="chartWidth"
            :height="chartHeight"
            class="vue-gantt__svg"
          >
            <!-- Grid Lines -->
            <GridLines
              :columns="timeColumns"
              :chart-height="chartHeight"
              :grid-color="gridColor"
              :show-grid="showGrid"
            />

            <!-- Project Group Backgrounds (shown when project grouping is enabled without swimlanes) -->
            <g v-if="enableProjectGrouping" class="vue-gantt__project-backgrounds">
              <ProjectGroupBackground
                v-for="project in renderedProjects"
                :key="`bg-${project.id}`"
                :y="project.y"
                :height="projectHeaderHeight"
                :chart-width="chartWidth"
                color="#f3f4f6"
              />
            </g>

            <!-- Swimlane Backgrounds (shown when swimlanes are enabled, with or without projects) -->
            <g v-if="enableSwimlanes" class="vue-gantt__swimlane-backgrounds">
              <SwimlaneBackground
                v-for="swimlane in renderedSwimlanes"
                :key="`bg-${swimlane.id}`"
                :y="swimlane.y"
                :height="swimlane.height"
                :chart-width="chartWidth"
                :color="swimlane.color || '#ffffff'"
              />
            </g>

            <!-- Today Indicator -->
            <TodayIndicator
              :today-x="todayX"
              :chart-height="chartHeight"
              :today-color="todayColor"
              :show-today="showToday"
            />

            <!-- Project Summary Bars -->
            <g v-if="enableProjectGrouping && showProjectSummary" class="vue-gantt__project-summaries">
              <ProjectSummaryBar
                v-for="project in renderedProjects"
                :key="`summary-${project.id}`"
                :x="project.x || 0"
                :y="project.y"
                :width="project.width || 0"
                :height="projectHeaderHeight"
                :bar-height="6"
              />
            </g>

            <!-- Task Bars -->
            <g class="vue-gantt__bars">
              <TaskBar
                v-for="task in visibleTasks"
                :key="task.id"
                :task="task"
                :bar-height="barHeight"
                :column-width="columnWidth"
                :chart-start-date="chartStartDate"
                :view-mode="options.viewMode || 'day'"
                :edit-duration="options.editDuration"
                :edit-position="options.editPosition"
                :show-progress="showTaskProgress"
                @update:task="handleTaskUpdate"
              />
            </g>

            <!-- Milestones -->
            <g class="vue-gantt__milestones">
              <MilestoneMarker
                v-for="milestone in visibleMilestones"
                :key="milestone.id"
                :milestone="milestone"
                :bar-height="barHeight"
                :milestone-size="milestoneSize"
                :show-label="showMilestoneLabels"
              />
            </g>

            <!-- Task Dependencies -->
            <DependencyArrows
              :arrows="dependencyArrows"
              :show-dependencies="showDependencies"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { GanttTask, GanttMilestone, GanttProject, GanttSwimlane, GanttOptions } from '@/types'
import { useGanttChart } from '@/composables/useGanttChart'
import { getDaysDiff } from '@/utils/dateDifference'
import GanttSidebar from './GanttSidebar.vue'
import TimelineHeader from './TimelineHeader.vue'
import GridLines from './GridLines.vue'
import TodayIndicator from './TodayIndicator.vue'
import TaskBar from './TaskBar.vue'
import MilestoneMarker from './MilestoneMarker.vue'
import DependencyArrows from './DependencyArrows.vue'
import TaskName from './TaskName.vue'
import ProjectHeader from './ProjectHeader.vue'
import SwimlaneLabel from './SwimlaneLabel.vue'
import ProjectSummaryBar from './ProjectSummaryBar.vue'
import ProjectGroupBackground from './ProjectGroupBackground.vue'
import SwimlaneBackground from './SwimlaneBackground.vue'
import { createRectangularPath } from '../utils/rectangularEdge'

const props = withDefaults(defineProps<{
  tasks: GanttTask[]
  milestones?: GanttMilestone[]
  projects?: GanttProject[]
  swimlanes?: GanttSwimlane[]
  options?: GanttOptions
}>(), {
  milestones: () => [],
  projects: () => [],
  swimlanes: () => [],
  options: () => ({})
})

const emit = defineEmits<{
  'update:tasks': [tasks: GanttTask[]]
  'task:update': [taskId: string, updates: { start?: Date; end?: Date }]
  'task:move': [taskId: string, start: Date, end: Date]
  'task:resize': [taskId: string, start: Date, end: Date]
}>()

const { tasks, milestones, projects, swimlanes, options } = toRefs(props)

const {
  chartStartDate,
  chartEndDate,
  timeColumns,
  renderedTasks,
  renderedMilestones,
  renderedProjects,
  renderedSwimlanes,
  chartWidth,
  chartHeight,
  toggleProject
} = useGanttChart(
  computed(() => tasks.value),
  computed(() => milestones.value), 
  computed(() => projects.value),
  computed(() => swimlanes.value),
  computed(() => options.value)
)

// Extract options with defaults
const barHeight = computed(() => options.value.barHeight || 30)
const columnWidth = computed(() => options.value.columnWidth || 40)
const barPadding = computed(() => options.value.barPadding || 4)
const showGrid = computed(() => options.value.showGrid !== false)
const showToday = computed(() => options.value.showToday !== false)
const showDependencies = computed(() => options.value.showDependencies !== false)
const gridColor = computed(() => options.value.gridColor || '#e5e7eb')
const todayColor = computed(() => options.value.todayColor || '#ef4444')
const enableProjectGrouping = computed(() => options.value.enableProjectGrouping || false)
const enableSwimlanes = computed(() => options.value.enableSwimlanes || false)
const projectHeaderHeight = computed(() => options.value.projectHeaderHeight || 35)
const milestoneSize = computed(() => options.value.milestoneSize || 16)
const showMilestoneLabels = computed(() => options.value.showMilestoneLabels !== false)
const hideOrphanDependencies = computed(() => options.value.hideOrphanDependencies !== false)
const showProjectSummary = computed(() => options.value.showProjectSummary !== false)
const showTaskProgress = computed(() => options.value.showTaskProgress || false)

// Handle task updates from drag operations
const handleTaskUpdate = (taskId: string, updates: { start?: Date; end?: Date }) => {
  // Find the task in the original tasks array
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  if (taskIndex === -1) return
  
  const task = tasks.value[taskIndex]
  
  // Create updated task
  const updatedTask = {
    ...task,
    start: updates.start || task.start,
    end: updates.end || task.end
  }
  
  // Create new tasks array with the updated task
  const updatedTasks = [...tasks.value]
  updatedTasks[taskIndex] = updatedTask
  
  // Emit update:tasks for v-model support
  emit('update:tasks', updatedTasks)
  
  // Emit specific event based on what changed
  emit('task:update', taskId, updates)
  
  // Emit more specific events
  if (updates.start && updates.end) {
    // Both changed - this is a move operation
    emit('task:move', taskId, updatedTask.start, updatedTask.end)
  } else if (updates.start || updates.end) {
    // Only one changed - this is a resize operation
    emit('task:resize', taskId, updatedTask.start, updatedTask.end)
  }
}

// Helper to get tasks for a specific project
const tasksForProject = (projectId: string) => {
  return tasks.value.filter(t => t.projectId === projectId)
}

// Helper to get swimlanes for a specific project
const swimlanesForProject = (projectId: string) => {
  return renderedSwimlanes.value.filter(s => s.id.startsWith(`${projectId}-`))
}

// Get orphan tasks (tasks without a project)
const orphanTasks = computed(() => {
  return tasks.value.filter(t => !t.projectId)
})

// Get orphan swimlanes (swimlanes without a project prefix in combined mode)
const orphanSwimlanes = computed(() => {
  return renderedSwimlanes.value.filter(s => !s.id.includes('-') || swimlanes.value.some(sl => sl.id === s.id))
})

// Filter visible tasks (used for rendering in project mode)
const visibleTasks = computed(() => {
  return renderedTasks.value.filter(t => t.isVisible !== false)
})
// Filter visible milestones (used for rendering in project mode)
const visibleMilestones = computed(() => {
  return renderedMilestones.value.filter(m => m.isVisible !== false)
})

// Calculate today's X position
const todayX = computed(() => {
  const today = new Date()
  if (today < chartStartDate.value || today > chartEndDate.value) {
    return null
  }
  const daysDiff = getDaysDiff(chartStartDate.value, today)
  return daysDiff * columnWidth.value
})

// Calculate dependency arrows
interface Arrow {
  id: string
  path: string
}

const dependencyArrows = computed<Arrow[]>(() => {
  const arrows: Arrow[] = []
  
  // Task to Task dependencies
  renderedTasks.value.forEach((task) => {
    // Skip if task is not visible (collapsed project) and hideOrphanDependencies is enabled
    if (hideOrphanDependencies.value && task.isVisible === false) return
    if (!task.dependencies || task.dependencies.length === 0) return
    
    task.dependencies.forEach((depId) => {
      // Check if dependency is a task
      const depTask = renderedTasks.value.find((t) => t.id === depId)
      if (depTask) {
        // Skip if dependency task is not visible (collapsed project) and hideOrphanDependencies is enabled
        if (hideOrphanDependencies.value && depTask.isVisible === false) return
        
        const startX = depTask.x + depTask.width
        const startY = depTask.y + barHeight.value / 2
        const endX = task.x
        const endY = task.y + barHeight.value / 2
        
        // Create a rectangular step arrow path
        const path = createRectangularPath(startX, startY, endX, endY, {
          offset: 20
        })
        
        arrows.push({
          id: `${depId}-${task.id}`,
          path
        })
        return
      }

      // Check if dependency is a milestone
      const depMilestone = renderedMilestones.value.find((m) => m.id === depId)
      if (depMilestone) {
        // Skip if dependency milestone is not visible (collapsed project) and hideOrphanDependencies is enabled
        if (hideOrphanDependencies.value && depMilestone.isVisible === false) return
        
        const startX = depMilestone.x + milestoneSize.value / 2 // Start from right edge of milestone diamond
        const startY = depMilestone.y + barHeight.value / 2
        const endX = task.x
        const endY = task.y + barHeight.value / 2
        
        // Create rectangular arrow path from milestone (starts from right edge)
        const path = createRectangularPath(startX, startY, endX, endY, {
          offset: 20
        })
        
        arrows.push({
          id: `${depId}-${task.id}`,
          path
        })
      }
    })
  })

  // Milestone to Milestone/Task dependencies
  renderedMilestones.value.forEach((milestone) => {
    // Skip if milestone is not visible (collapsed project) and hideOrphanDependencies is enabled
    if (hideOrphanDependencies.value && milestone.isVisible === false) return
    if (!milestone.dependencies || milestone.dependencies.length === 0) return
    
    milestone.dependencies.forEach((depId) => {
      // Check if dependency is a task
      const depTask = renderedTasks.value.find((t) => t.id === depId)
      if (depTask) {
        // Skip if dependency task is not visible (collapsed project) and hideOrphanDependencies is enabled
        if (hideOrphanDependencies.value && depTask.isVisible === false) return
        
        const startX = depTask.x + depTask.width
        const startY = depTask.y + barHeight.value / 2
        const endX = milestone.x - milestoneSize.value / 2 // Point to left edge of milestone diamond
        const endY = milestone.y + barHeight.value / 2
        
        // Create rectangular arrow path to milestone (ends at left edge)
        const path = createRectangularPath(startX, startY, endX, endY, {
          offset: 20
        })
        
        arrows.push({
          id: `${depId}-${milestone.id}`,
          path
        })
        return
      }

      // Check if dependency is another milestone
      const depMilestone = renderedMilestones.value.find((m) => m.id === depId)
      if (depMilestone) {
        // Skip if dependency milestone is not visible (collapsed project) and hideOrphanDependencies is enabled
        if (hideOrphanDependencies.value && depMilestone.isVisible === false) return
        
        const startX = depMilestone.x + milestoneSize.value / 2 // Start from right edge of milestone diamond
        const startY = depMilestone.y + barHeight.value / 2
        const endX = milestone.x - milestoneSize.value / 2 // Point to left edge of milestone diamond
        const endY = milestone.y + barHeight.value / 2
        
        // Create rectangular arrow path from milestone to milestone (starts at right edge, ends at left edge)
        const path = createRectangularPath(startX, startY, endX, endY, {
          offset: 20
        })
        
        arrows.push({
          id: `${depId}-${milestone.id}`,
          path
        })
      }
    })
  })
  
  return arrows
})

// Check if we should use two-row headers
const useTwoRowHeaders = computed(() => {
  const mode = options.value.viewMode || 'day'
  return mode === 'hour' || mode === 'day' || mode === 'week' || mode === 'month'
})

// Group time columns by primary periods for two-row headers
interface PrimaryPeriod {
  label: string
  x: number
  width: number
  columns: typeof timeColumns.value
}

const primaryPeriods = computed<PrimaryPeriod[]>(() => {
  if (!useTwoRowHeaders.value) {
    return []
  }

  const periods: PrimaryPeriod[] = []
  let currentPeriod: PrimaryPeriod | null = null

  timeColumns.value.forEach((column, index) => {
    if (column.isPrimaryStart || index === 0) {
      // Start a new primary period
      if (currentPeriod) {
        periods.push(currentPeriod)
      }
      currentPeriod = {
        label: column.primaryLabel || '',
        x: column.x,
        width: column.width || columnWidth.value,
        columns: [column]
      }
    } else if (currentPeriod) {
      // Continue current primary period
      currentPeriod.width += column.width || columnWidth.value
      currentPeriod.columns.push(column)
    }
  })

  // Add the last period
  if (currentPeriod) {
    periods.push(currentPeriod)
  }

  return periods
})
</script>

<style scoped>
.vue-gantt {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.vue-gantt__container {
  display: flex;
  min-width: min-content;
}

.vue-gantt__chart-container {
  flex: 1;
  overflow: hidden;
}

.vue-gantt__chart {
  position: relative;
}

.vue-gantt__svg {
  display: block;
}
</style>
