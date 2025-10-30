import type { Meta, StoryObj } from "@storybook/vue3";
import GanttChart from "../components/GanttChart.vue";
import type {
  GanttTask,
  GanttMilestone,
  GanttProject,
  GanttSwimlane,
} from "../types";

const meta: Meta<typeof GanttChart> = {
  title: "Components/GanttChart",
  component: GanttChart,
  tags: ["autodocs"],
  argTypes: {
    tasks: {
      description: "Array of tasks to display in the Gantt chart",
      control: "object",
    },
    options: {
      description: "Configuration options for the Gantt chart",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

// Sample tasks for reuse
const sampleTasks: GanttTask[] = [
  {
    id: "1",
    name: "Project Planning",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-15"),
    progress: 100,
    color: "#10b981",
  },
  {
    id: "2",
    name: "Requirements Analysis",
    start: new Date("2024-10-10"),
    end: new Date("2024-10-25"),
    progress: 100,
    dependencies: ["1"],
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "UI/UX Design",
    start: new Date("2024-10-20"),
    end: new Date("2024-11-10"),
    progress: 75,
    dependencies: ["2"],
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "Frontend Development",
    start: new Date("2024-11-01"),
    end: new Date("2024-12-15"),
    progress: 45,
    dependencies: ["3"],
    color: "#f59e0b",
  },
  {
    id: "5",
    name: "Backend Development",
    start: new Date("2024-11-05"),
    end: new Date("2024-12-20"),
    progress: 40,
    dependencies: ["2"],
    color: "#ef4444",
  },
  {
    id: "6",
    name: "Integration Testing",
    start: new Date("2024-12-10"),
    end: new Date("2024-12-28"),
    progress: 20,
    dependencies: ["4", "5"],
    color: "#06b6d4",
  },
];

// Default story
export const Default: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      barHeight: 30,
      columnWidth: 40,
      showGrid: true,
      showToday: true,
      showDependencies: true,
    },
  },
};

// Day view
export const DayView: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      barHeight: 30,
      columnWidth: 40,
    },
  },
};

// Week view
export const WeekView: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "week",
      barHeight: 30,
      columnWidth: 50,
    },
  },
};

// Month view
export const MonthView: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "month",
      barHeight: 30,
      columnWidth: 60,
    },
  },
};

// Hour view
export const HourView: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Morning Meeting",
        start: new Date("2024-10-27T09:00:00"),
        end: new Date("2024-10-27T10:30:00"),
        progress: 100,
        color: "#10b981",
      },
      {
        id: "2",
        name: "Development Sprint",
        start: new Date("2024-10-27T10:30:00"),
        end: new Date("2024-10-27T16:00:00"),
        progress: 60,
        color: "#3b82f6",
      },
      {
        id: "3",
        name: "Code Review",
        start: new Date("2024-10-27T16:00:00"),
        end: new Date("2024-10-27T17:30:00"),
        progress: 30,
        color: "#8b5cf6",
      },
    ],
    options: {
      viewMode: "hour",
      barHeight: 30,
      columnWidth: 60,
    },
  },
};

// Year view
export const YearView: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Phase 1: Research",
        start: new Date("2024-01-01"),
        end: new Date("2025-06-30"),
        progress: 100,
        color: "#10b981",
      },
      {
        id: "2",
        name: "Phase 2: Development",
        start: new Date("2025-03-01"),
        end: new Date("2026-12-31"),
        progress: 45,
        color: "#3b82f6",
      },
      {
        id: "3",
        name: "Phase 3: Deployment",
        start: new Date("2026-06-01"),
        end: new Date("2027-12-31"),
        progress: 0,
        color: "#8b5cf6",
      },
    ],
    options: {
      viewMode: "year",
      barHeight: 30,
      columnWidth: 80,
    },
  },
};

// Without dependencies
export const WithoutDependencies: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      showDependencies: false,
    },
  },
};

// Without grid
export const WithoutGrid: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      showGrid: false,
    },
  },
};

// Large bars
export const LargeBars: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      barHeight: 50,
      columnWidth: 60,
      barPadding: 10,
    },
  },
};

// Small bars
export const SmallBars: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      barHeight: 20,
      columnWidth: 30,
      barPadding: 2,
    },
  },
};

// Simple project
export const SimpleProject: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Task 1",
        start: new Date("2024-11-01"),
        end: new Date("2024-11-05"),
        progress: 100,
        color: "#10b981",
      },
      {
        id: "2",
        name: "Task 2",
        start: new Date("2024-11-03"),
        end: new Date("2024-11-08"),
        progress: 75,
        color: "#3b82f6",
      },
      {
        id: "3",
        name: "Task 3",
        start: new Date("2024-11-06"),
        end: new Date("2024-11-12"),
        progress: 30,
        color: "#f59e0b",
      },
    ],
    options: {
      viewMode: "day",
    },
  },
};

// Long project
export const LongProject: Story = {
  args: {
    tasks: [
      {
        id: "1",
        name: "Phase 1",
        start: new Date("2024-01-01"),
        end: new Date("2024-03-31"),
        progress: 100,
        color: "#10b981",
      },
      {
        id: "2",
        name: "Phase 2",
        start: new Date("2024-03-01"),
        end: new Date("2024-06-30"),
        progress: 80,
        dependencies: ["1"],
        color: "#3b82f6",
      },
      {
        id: "3",
        name: "Phase 3",
        start: new Date("2024-06-01"),
        end: new Date("2024-09-30"),
        progress: 50,
        dependencies: ["2"],
        color: "#f59e0b",
      },
      {
        id: "4",
        name: "Phase 4",
        start: new Date("2024-09-01"),
        end: new Date("2024-12-31"),
        progress: 20,
        dependencies: ["3"],
        color: "#ef4444",
      },
    ],
    options: {
      viewMode: "month",
    },
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    tasks: sampleTasks,
    options: {
      viewMode: "day",
      gridColor: "#cbd5e1",
      todayColor: "#22c55e",
    },
  },
};

// No progress
export const NoProgress: Story = {
  args: {
    tasks: sampleTasks.map((task) => ({ ...task, progress: 0 })),
    options: {
      viewMode: "day",
    },
  },
};

// Full progress
export const FullProgress: Story = {
  args: {
    tasks: sampleTasks.map((task) => ({ ...task, progress: 100 })),
    options: {
      viewMode: "day",
    },
  },
};

// With Project Grouping
const projectTasks: GanttTask[] = [
  {
    id: "1",
    name: "Planning Phase",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-15"),
    progress: 100,
    color: "#10b981",
    projectId: "project-1",
  },
  {
    id: "2",
    name: "Requirements Gathering",
    start: new Date("2024-10-05"),
    end: new Date("2024-10-20"),
    progress: 100,
    color: "#10b981",
    projectId: "project-1",
  },
  {
    id: "3",
    name: "Frontend Setup",
    start: new Date("2024-10-15"),
    end: new Date("2024-11-01"),
    progress: 80,
    color: "#3b82f6",
    projectId: "project-2",
  },
  {
    id: "4",
    name: "Component Development",
    start: new Date("2024-10-25"),
    end: new Date("2024-11-20"),
    progress: 60,
    color: "#3b82f6",
    projectId: "project-2",
  },
  {
    id: "5",
    name: "Styling",
    start: new Date("2024-11-05"),
    end: new Date("2024-11-25"),
    progress: 40,
    color: "#3b82f6",
    projectId: "project-2",
  },
  {
    id: "6",
    name: "API Design",
    start: new Date("2024-10-20"),
    end: new Date("2024-11-05"),
    progress: 90,
    color: "#f59e0b",
    projectId: "project-3",
  },
  {
    id: "7",
    name: "Database Schema",
    start: new Date("2024-10-25"),
    end: new Date("2024-11-10"),
    progress: 75,
    color: "#f59e0b",
    projectId: "project-3",
  },
  {
    id: "8",
    name: "Implementation",
    start: new Date("2024-11-01"),
    end: new Date("2024-12-01"),
    progress: 50,
    color: "#f59e0b",
    projectId: "project-3",
  },
];

const projects: GanttProject[] = [
  {
    id: "project-1",
    name: "Planning & Requirements",
  },
  {
    id: "project-2",
    name: "Frontend Development",
  },
  {
    id: "project-3",
    name: "Backend Development",
  },
];

export const WithProjectGrouping: Story = {
  args: {
    tasks: projectTasks,
    projects: projects,
    options: {
      viewMode: "day",
      enableProjectGrouping: true,
    },
  },
};

// With Milestones
const milestoneTasks: GanttTask[] = [
  {
    id: "1",
    name: "Project Kickoff",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-05"),
    progress: 100,
    color: "#10b981",
  },
  {
    id: "2",
    name: "Design Phase",
    start: new Date("2024-10-06"),
    end: new Date("2024-10-20"),
    progress: 100,
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Development Sprint 1",
    start: new Date("2024-10-21"),
    end: new Date("2024-11-10"),
    progress: 80,
    color: "#8b5cf6",
  },
  {
    id: "4",
    name: "Development Sprint 2",
    start: new Date("2024-11-11"),
    end: new Date("2024-12-01"),
    progress: 60,
    color: "#8b5cf6",
  },
  {
    id: "5",
    name: "Testing & QA",
    start: new Date("2024-12-02"),
    end: new Date("2024-12-20"),
    progress: 40,
    color: "#f59e0b",
  },
];

const milestones: GanttMilestone[] = [
  {
    id: "m1",
    name: "Design Complete",
    date: new Date("2024-10-20"),
    color: "#3b82f6",
    dependencies: ["2"], // Depends on Design Phase task
  },
  {
    id: "m2",
    name: "MVP Ready",
    date: new Date("2024-11-10"),
    color: "#8b5cf6",
    dependencies: ["3"], // Depends on Development Sprint 1
  },
  {
    id: "m3",
    name: "Beta Release",
    date: new Date("2024-12-01"),
    color: "#8b5cf6",
    dependencies: ["m2"], // Depends on MVP Ready milestone
  },
  {
    id: "m4",
    name: "Launch",
    date: new Date("2024-12-20"),
    color: "#ef4444",
    dependencies: ["5", "m3"], // Depends on Testing & QA task and Beta Release milestone
  },
];

export const WithMilestones: Story = {
  args: {
    tasks: milestoneTasks,
    milestones: milestones,
    options: {
      viewMode: "day",
      showMilestoneLabels: true,
      showDependencies: true,
    },
  },
};

// Generate 1000 tasks for performance testing
const generate1000Tasks = (): GanttTask[] => {
  const tasks: GanttTask[] = [];
  const colors = [
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
  ];
  const startDate = new Date("2024-01-01");

  for (let i = 0; i < 1000; i++) {
    // Distribute tasks across 12 months
    const monthOffset = Math.floor(i / 84); // ~84 tasks per month
    const dayOffset = (i % 84) * 3; // Each task starts 3 days after the previous in its month

    const taskStart = new Date(startDate);
    taskStart.setMonth(startDate.getMonth() + monthOffset);
    taskStart.setDate(startDate.getDate() + dayOffset);

    const taskEnd = new Date(taskStart);
    taskEnd.setDate(taskStart.getDate() + Math.floor(Math.random() * 14) + 3); // 3-17 days duration

    tasks.push({
      id: `task-${i + 1}`,
      name: `Task ${i + 1}`,
      start: taskStart,
      end: taskEnd,
      progress: Math.floor(Math.random() * 101), // 0-100
      color: colors[i % colors.length],
    });
  }

  return tasks;
};

export const Performance1000Tasks: Story = {
  args: {
    tasks: generate1000Tasks(),
    options: {
      viewMode: "month",
      barHeight: 25,
      columnWidth: 60,
      showGrid: true,
      showToday: true,
      showDependencies: false, // Disable for better performance with many tasks
      barPadding: 2,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Performance test with 1000 tasks. Dependencies are disabled for better rendering performance.",
      },
    },
  },
};

// Swim lanes data
const swimlanes: GanttSwimlane[] = [
  {
    id: "team-a",
    name: "Development Team A",
    color: "#eff6ff",
  },
  {
    id: "team-b",
    name: "Development Team B",
    color: "#fef3f2",
  },
  {
    id: "team-qa",
    name: "QA Team",
    color: "#f0fdf4",
  },
];

// Tasks for swim lanes
const swimlaneTasks: GanttTask[] = [
  // Team A tasks
  {
    id: "1",
    name: "Project Planning",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-15"),
    progress: 100,
    color: "#10b981",
    swimlaneId: "team-a",
  },
  {
    id: "2",
    name: "Requirements Analysis",
    start: new Date("2024-10-10"),
    end: new Date("2024-10-25"),
    progress: 100,
    dependencies: ["1"],
    color: "#10b981",
    swimlaneId: "team-a",
  },
  {
    id: "3",
    name: "Frontend Development",
    start: new Date("2024-11-01"),
    end: new Date("2024-12-15"),
    progress: 45,
    color: "#3b82f6",
    swimlaneId: "team-a",
  },
  {
    id: "4",
    name: "Deployment Setup",
    start: new Date("2024-12-10"),
    end: new Date("2024-12-20"),
    progress: 20,
    color: "#14b8a6",
    swimlaneId: "team-a",
  },
  // Team B tasks
  {
    id: "5",
    name: "UI/UX Design",
    start: new Date("2024-10-20"),
    end: new Date("2024-11-10"),
    progress: 75,
    dependencies: ["2"],
    color: "#8b5cf6",
    swimlaneId: "team-b",
  },
  {
    id: "6",
    name: "Backend Development",
    start: new Date("2024-11-05"),
    end: new Date("2024-12-20"),
    progress: 40,
    dependencies: ["2"],
    color: "#3b82f6",
    swimlaneId: "team-b",
  },
  {
    id: "7",
    name: "Database Setup",
    start: new Date("2024-10-18"),
    end: new Date("2024-10-30"),
    progress: 100,
    color: "#3b82f6",
    swimlaneId: "team-b",
  },
  // QA Team tasks
  {
    id: "8",
    name: "Integration Testing",
    start: new Date("2024-12-10"),
    end: new Date("2024-12-28"),
    progress: 20,
    dependencies: ["3", "6"],
    color: "#f59e0b",
    swimlaneId: "team-qa",
  },
  {
    id: "9",
    name: "User Acceptance Testing",
    start: new Date("2024-12-20"),
    end: new Date("2025-01-10"),
    progress: 10,
    dependencies: ["8"],
    color: "#f59e0b",
    swimlaneId: "team-qa",
  },
  {
    id: "10",
    name: "Security Audit",
    start: new Date("2024-11-15"),
    end: new Date("2024-12-05"),
    progress: 60,
    color: "#ef4444",
    swimlaneId: "team-qa",
  },
];

// With Swim Lanes
export const WithSwimlanes: Story = {
  args: {
    tasks: swimlaneTasks,
    swimlanes: swimlanes,
    options: {
      viewMode: "day",
      enableSwimlanes: true,
      showTaskNameInBar: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tasks organized in swim lanes. Multiple tasks can appear in the same lane if they don't overlap. Task names are shown inside the bars.",
      },
    },
  },
};

// Tasks with both project and swimlane IDs
const projectSwimlaneTasks: GanttTask[] = [
  // Planning project - Team A
  {
    id: "1",
    name: "Project Planning",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-15"),
    progress: 100,
    color: "#10b981",
    projectId: "project-1",
    swimlaneId: "team-a",
  },
  {
    id: "2",
    name: "Requirements Analysis",
    start: new Date("2024-10-10"),
    end: new Date("2024-10-25"),
    progress: 100,
    dependencies: ["1"],
    color: "#10b981",
    projectId: "project-1",
    swimlaneId: "team-a",
  },
  // Planning project - Team B
  {
    id: "3",
    name: "Research",
    start: new Date("2024-10-05"),
    end: new Date("2024-10-20"),
    progress: 100,
    color: "#10b981",
    projectId: "project-1",
    swimlaneId: "team-b",
  },
  // Development project - Team A
  {
    id: "4",
    name: "Frontend Setup",
    start: new Date("2024-10-15"),
    end: new Date("2024-11-01"),
    progress: 80,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-a",
  },
  {
    id: "5",
    name: "Component Development",
    start: new Date("2024-10-25"),
    end: new Date("2024-11-20"),
    progress: 60,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-a",
  },
  {
    id: "6",
    name: "Styling",
    start: new Date("2024-11-05"),
    end: new Date("2024-11-25"),
    progress: 40,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-a",
  },
  // Development project - Team B
  {
    id: "7",
    name: "API Design",
    start: new Date("2024-10-20"),
    end: new Date("2024-11-05"),
    progress: 90,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-b",
  },
  {
    id: "8",
    name: "Database Schema",
    start: new Date("2024-10-25"),
    end: new Date("2024-11-10"),
    progress: 75,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-b",
  },
  {
    id: "9",
    name: "Implementation",
    start: new Date("2024-11-01"),
    end: new Date("2024-12-01"),
    progress: 50,
    color: "#3b82f6",
    projectId: "project-2",
    swimlaneId: "team-b",
  },
  // Testing project - QA Team
  {
    id: "10",
    name: "Test Planning",
    start: new Date("2024-11-15"),
    end: new Date("2024-11-25"),
    progress: 80,
    color: "#f59e0b",
    projectId: "project-3",
    swimlaneId: "team-qa",
  },
  {
    id: "11",
    name: "Integration Testing",
    start: new Date("2024-11-20"),
    end: new Date("2024-12-10"),
    progress: 60,
    color: "#f59e0b",
    projectId: "project-3",
    swimlaneId: "team-qa",
  },
  {
    id: "12",
    name: "UAT",
    start: new Date("2024-12-05"),
    end: new Date("2024-12-20"),
    progress: 40,
    color: "#f59e0b",
    projectId: "project-3",
    swimlaneId: "team-qa",
  },
];

// With both Project Grouping and Swim Lanes
export const WithProjectsAndSwimlanes: Story = {
  args: {
    tasks: projectSwimlaneTasks,
    projects: projects,
    swimlanes: swimlanes,
    options: {
      viewMode: "day",
      enableProjectGrouping: true,
      enableSwimlanes: true,
      showTaskNameInBar: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tasks organized by both projects and swim lanes. Projects can be collapsed/expanded. Within each project, tasks are grouped by swim lanes with automatic row packing.",
      },
    },
  },
};

// Swim lanes with overlapping tasks demonstration
const overlappingTasks: GanttTask[] = [
  // Team A - Multiple overlapping tasks that will be packed into rows
  {
    id: "1",
    name: "Task A1",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-10"),
    progress: 100,
    color: "#10b981",
    swimlaneId: "team-a",
  },
  {
    id: "2",
    name: "Task A2",
    start: new Date("2024-10-05"),
    end: new Date("2024-10-15"),
    progress: 80,
    color: "#3b82f6",
    swimlaneId: "team-a",
  },
  {
    id: "3",
    name: "Task A3",
    start: new Date("2024-10-12"),
    end: new Date("2024-10-20"),
    progress: 60,
    color: "#8b5cf6",
    swimlaneId: "team-a",
  },
  {
    id: "4",
    name: "Task A4",
    start: new Date("2024-10-08"),
    end: new Date("2024-10-18"),
    progress: 70,
    color: "#f59e0b",
    swimlaneId: "team-a",
  },
  {
    id: "5",
    name: "Task A5",
    start: new Date("2024-10-16"),
    end: new Date("2024-10-25"),
    progress: 50,
    color: "#ef4444",
    swimlaneId: "team-a",
  },
  // Team B - Non-overlapping tasks (will be in single row)
  {
    id: "6",
    name: "Task B1",
    start: new Date("2024-10-01"),
    end: new Date("2024-10-07"),
    progress: 100,
    color: "#10b981",
    swimlaneId: "team-b",
  },
  {
    id: "7",
    name: "Task B2",
    start: new Date("2024-10-08"),
    end: new Date("2024-10-14"),
    progress: 90,
    color: "#3b82f6",
    swimlaneId: "team-b",
  },
  {
    id: "8",
    name: "Task B3",
    start: new Date("2024-10-15"),
    end: new Date("2024-10-21"),
    progress: 80,
    color: "#8b5cf6",
    swimlaneId: "team-b",
  },
];

export const SwimlanesWithOverlappingTasks: Story = {
  args: {
    tasks: overlappingTasks,
    swimlanes: swimlanes.slice(0, 2), // Only Team A and Team B
    options: {
      viewMode: "day",
      enableSwimlanes: true,
      showTaskNameInBar: true,
      barHeight: 30,
      barPadding: 8,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates automatic task packing in swim lanes. Team A has overlapping tasks that are packed into multiple rows, while Team B has sequential tasks in a single row.",
      },
    },
  },
};
