<template>
  <div id="app">
    <h1>Vue Gantt Chart Library</h1>
    <p>A flexible and customizable Gantt chart component for Vue 3</p>

    <div class="controls">
      <h2>Chart Options</h2>
      <div class="control-group">
        <div class="control">
          <label for="viewMode">View Mode</label>
          <select id="viewMode" v-model="viewMode">
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        <div class="control">
          <label for="barHeight">Bar Height (px)</label>
          <input
            id="barHeight"
            v-model.number="barHeight"
            type="number"
            min="20"
            max="60"
          />
        </div>

        <div class="control">
          <label for="barPadding">Vertical Spacing (px)</label>
          <input
            id="barPadding"
            v-model.number="barPadding"
            type="number"
            min="0"
            max="100"
          />
        </div>

        <div class="control">
          <label for="columnWidth">Column Width (px)</label>
          <input
            id="columnWidth"
            v-model.number="columnWidth"
            type="number"
            min="20"
            max="100"
          />
        </div>

        <div class="control">
          <label for="showGrid">Show Grid</label>
          <input id="showGrid" v-model="showGrid" type="checkbox" />
        </div>

        <div class="control">
          <label for="showToday">Show Today</label>
          <input id="showToday" v-model="showToday" type="checkbox" />
        </div>

        <div class="control">
          <label for="showDependencies">Show Dependencies</label>
          <input id="showDependencies" v-model="showDependencies" type="checkbox" />
        </div>

        <div class="control">
          <label for="enableProjectGrouping">Enable Project Grouping</label>
          <input id="enableProjectGrouping" v-model="enableProjectGrouping" type="checkbox" />
        </div>

        <div class="control">
          <label for="showProjectSummary">Show Project Summary</label>
          <input id="showProjectSummary" v-model="showProjectSummary" type="checkbox" />
        </div>

        <div class="control">
          <label for="enableSwimlanes">Enable Swim Lanes</label>
          <input id="enableSwimlanes" v-model="enableSwimlanes" type="checkbox" />
        </div>

        <div class="control">
          <label for="editPosition">Allow Moving Tasks</label>
          <input id="editPosition" v-model="editPosition" type="checkbox" />
        </div>

        <div class="control">
          <label for="editDuration">Allow Resizing Tasks</label>
          <input id="editDuration" v-model="editDuration" type="checkbox" />
        </div>

        <div class="control">
          <label for="hideOrphanDependencies">Hide Orphan Dependencies</label>
          <input id="hideOrphanDependencies" v-model="hideOrphanDependencies" type="checkbox" />
        </div>

        <div class="control">
          <label for="showTaskProgress">Show Task Progress (%)</label>
          <input id="showTaskProgress" v-model="showTaskProgress" type="checkbox" />
        </div>
      </div>
    </div>

    <div class="chart-container">
      <GanttChart 
        v-model:tasks="tasks" 
        :milestones="milestones"
        :projects="projects" 
        :swimlanes="swimlanes"
        :options="options" 
        @task:update="onTaskUpdate"
        @task:move="onTaskMove"
        @task:resize="onTaskResize"
        @click="onClick"
      />
    </div>

    <!-- Event Log -->
    <div v-if="eventLog.length > 0" class="event-log">
      <h2>Event Log</h2>
      <button @click="eventLog = []" class="clear-log">Clear Log</button>
      <div class="log-entries">
        <div v-for="(event, index) in eventLog" :key="index" class="log-entry">
          <span class="log-time">{{ event.time }}</span>
          <span class="log-type">{{ event.type }}</span>
          <span class="log-details">{{ event.details }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GanttChart from '../components/GanttChart.vue'
import type { GanttTask, GanttProject, GanttSwimlane, GanttMilestone, GanttOptions, ViewMode } from '../types'

// Sample tasks data with project IDs and swimlane IDs
const tasks = ref<GanttTask[]>([
  {
    id: '1',
    name: 'Project Planning',
    start: new Date('2025-10-01'),
    end: new Date('2025-10-15'),
    progress: 100,
    color: '#10b981',
    projectId: 'planning',
    swimlaneId: 'team1'
  },
  {
    id: '2',
    name: 'Requirements Analysis',
    start: new Date('2025-10-10'),
    end: new Date('2025-10-25'),
    progress: 100,
    dependencies: ['1'],
    color: '#10b981',
    projectId: 'planning',
    swimlaneId: 'team1'
  },
  {
    id: '3',
    name: 'UI/UX Design',
    start: new Date('2025-10-20'),
    end: new Date('2025-11-10'),
    progress: 75,
    dependencies: ['2'],
    color: '#8b5cf6',
    projectId: 'design',
    swimlaneId: 'team2'
  },
  {
    id: '4',
    name: 'Frontend Development',
    start: new Date('2025-11-01'),
    end: new Date('2025-12-15'),
    progress: 45,
    dependencies: ['3'],
    color: '#3b82f6',
    projectId: 'development',
    swimlaneId: 'team1'
  },
  {
    id: '5',
    name: 'Backend Development',
    start: new Date('2025-11-05'),
    end: new Date('2025-12-20'),
    progress: 40,
    dependencies: ['2'],
    color: '#3b82f6',
    projectId: 'development',
    swimlaneId: 'team2'
  },
  {
    id: '6',
    name: 'Integration Testing',
    start: new Date('2025-12-10'),
    end: new Date('2025-12-28'),
    progress: 20,
    dependencies: ['4', '5'],
    color: '#f59e0b',
    projectId: 'testing',
    swimlaneId: 'team3'
  },
  {
    id: '7',
    name: 'User Acceptance Testing',
    start: new Date('2025-12-20'),
    end: new Date('2026-01-10'),
    progress: 10,
    dependencies: ['6'],
    color: '#f59e0b',
    projectId: 'testing',
    swimlaneId: 'team3'
  },
  {
    id: '8',
    name: 'Deployment',
    start: new Date('2026-01-05'),
    end: new Date('2026-01-15'),
    progress: 0,
    dependencies: ['7'],
    color: '#14b8a6',
    projectId: 'deployment',
    swimlaneId: 'team1'
  },
  {
    id: '9',
    name: 'Database Setup',
    start: new Date('2025-10-18'),
    end: new Date('2025-10-30'),
    progress: 100,
    color: '#3b82f6',
    projectId: 'development',
    swimlaneId: 'team2'
  },
  {
    id: '10',
    name: 'Security Audit',
    start: new Date('2025-11-15'),
    end: new Date('2025-12-05'),
    progress: 60,
    color: '#ef4444',
    projectId: 'testing',
    swimlaneId: 'team3'
  },
])

// Milestones data
const milestones = ref<GanttMilestone[]>([
  {
    id: 'm1',
    name: 'Requirements Complete',
    date: new Date('2025-10-25'),
    color: '#10b981',
    projectId: 'planning'
  },
  {
    id: 'm2',
    name: 'Design Approved',
    date: new Date('2025-11-10'),
    color: '#8b5cf6',
    projectId: 'design'
  },
  {
    id: 'm3',
    name: 'Beta Release',
    date: new Date('2025-12-28'),
    color: '#f59e0b',
    projectId: 'testing',
    dependencies: ['6']
  },
  {
    id: 'm4',
    name: 'Production Launch',
    date: new Date('2026-01-15'),
    color: '#14b8a6',
    projectId: 'deployment',
    dependencies: ['8']
  }
])

// Projects data
const projects = ref<GanttProject[]>([
  {
    id: 'planning',
    name: 'Planning & Requirements',
  },
  {
    id: 'design',
    name: 'Design Phase',
  },
  {
    id: 'development',
    name: 'Development Phase',
  },
  {
    id: 'testing',
    name: 'Testing Phase',
  },
  {
    id: 'deployment',
    name: 'Deployment Phase',
  }
])

// Swim lanes data
const swimlanes = ref<GanttSwimlane[]>([
  {
    id: 'team1',
    name: 'Development Team A',
    color: '#eff6ff'
  },
  {
    id: 'team2',
    name: 'Development Team B',
    color: '#fef3f2'
  },
  {
    id: 'team3',
    name: 'QA Team',
    color: '#f0fdf4'
  }
])

// Chart options
const viewMode = ref<ViewMode>('day')
const barHeight = ref(30)
const barPadding = ref(10)
const columnWidth = ref(40)
const showGrid = ref(true)
const showToday = ref(true)
const showDependencies = ref(true)
const enableProjectGrouping = ref(false)
const showProjectSummary = ref(true)
const enableSwimlanes = ref(false)
const editPosition = ref(true)
const editDuration = ref(true)
const hideOrphanDependencies = ref(false)
const showTaskProgress = ref(false)

// Event log
interface LogEvent {
  time: string
  type: string
  details: string
}

const eventLog = ref<LogEvent[]>([])

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const onTaskUpdate = (taskId: string, updates: { start?: Date; end?: Date }) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  
  const details = []
  if (updates.start) {
    details.push(`Start: ${formatDate(updates.start)}`)
  }
  if (updates.end) {
    details.push(`End: ${formatDate(updates.end)}`)
  }
  
  eventLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type: 'Task Update',
    details: `${task.name} - ${details.join(', ')}`
  })
  
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const onTaskMove = (taskId: string, start: Date, end: Date) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  
  eventLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type: 'Task Moved',
    details: `${task.name} - ${formatDate(start)} to ${formatDate(end)}`
  })
  
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const onTaskResize = (taskId: string, start: Date, end: Date) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (!task) return
  
  eventLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type: 'Task Resized',
    details: `${task.name} - ${formatDate(start)} to ${formatDate(end)}`
  })
  
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const onClick = (_event: MouseEvent, type: 'task' | 'milestone' | 'summary', data: GanttTask | GanttMilestone | GanttProject) => {
  let name = ''
  let details = ''
  
  if (type === 'task') {
    const task = data as GanttTask
    name = task.name
    details = `Progress: ${task.progress}%, ${formatDate(task.start)} - ${formatDate(task.end)}`
  } else if (type === 'milestone') {
    const milestone = data as GanttMilestone
    name = milestone.name
    details = `Date: ${formatDate(milestone.date)}`
  } else if (type === 'summary') {
    const project = data as GanttProject
    name = project.name
    details = 'Project Summary'
  }
  
  eventLog.value.unshift({
    time: new Date().toLocaleTimeString(),
    type: `${type.charAt(0).toUpperCase() + type.slice(1)} Clicked`,
    details: `${name} - ${details}`
  })
  
  // Keep only last 10 events
  if (eventLog.value.length > 10) {
    eventLog.value = eventLog.value.slice(0, 10)
  }
}

const options = computed<GanttOptions>(() => ({
  viewMode: viewMode.value,
  barHeight: barHeight.value,
  barPadding: barPadding.value,
  columnWidth: columnWidth.value,
  showGrid: showGrid.value,
  showToday: showToday.value,
  showDependencies: showDependencies.value,
  enableProjectGrouping: enableProjectGrouping.value,
  showProjectSummary: showProjectSummary.value,
  enableSwimlanes: enableSwimlanes.value,
  editPosition: editPosition.value,
  editDuration: editDuration.value,
  hideOrphanDependencies: hideOrphanDependencies.value,
  showTaskProgress: showTaskProgress.value,
}))
</script>
