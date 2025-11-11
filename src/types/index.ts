/**
 * Represents a single task in the Gantt chart
 */
export interface GanttTask {
  /** Unique identifier for the task */
  id: string;
  /** Display name of the task */
  name: string;
  /** Start date of the task */
  start: Date;
  /** End date of the task */
  end: Date;
  /** Progress percentage (0-100) */
  progress: number;
  /** Optional custom color for the task bar */
  color?: string;
  /** Optional array of task IDs this task depends on */
  dependencies?: string[];
  /** Optional metadata that can be attached to the task */
  metadata?: Record<string, unknown>;
  /** Optional project ID this task belongs to */
  projectId?: string;
  /** Whether this is a milestone (renders as diamond) */
  isMilestone?: boolean;
  /** Optional swim lane ID this task belongs to */
  swimlaneId?: string;
}

/**
 * Represents a milestone in the Gantt chart
 */
export interface GanttMilestone {
  /** Unique identifier for the milestone */
  id: string;
  /** Display name of the milestone */
  name: string;
  /** Date of the milestone */
  date: Date;
  /** Optional custom color for the milestone */
  color?: string;
  /** Optional project ID this milestone belongs to */
  projectId?: string;
  /** Optional array of task/milestone IDs this milestone depends on */
  dependencies?: string[];
  /** Optional metadata that can be attached to the milestone */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a project that contains tasks
 */
export interface GanttProject {
  /** Unique identifier for the project */
  id: string;
  /** Display name of the project */
  name: string;
  /** Optional metadata that can be attached to the project */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a swim lane for grouping tasks
 */
export interface GanttSwimlane {
  /** Unique identifier for the swim lane */
  id: string;
  /** Display name of the swim lane */
  name: string;
  /** Optional custom color for the swim lane */
  color?: string;
  /** Optional metadata that can be attached to the swim lane */
  metadata?: Record<string, unknown>;
}

/**
 * View mode for the Gantt chart timeline
 */
export type ViewMode = "hour" | "day" | "week" | "month" | "year";

/**
 * Configuration options for the Gantt chart
 */
export interface GanttOptions {
  /** View mode determining the time scale granularity */
  viewMode?: ViewMode;
  /** Height of task bars in pixels */
  barHeight?: number;
  /** Width of time columns in pixels */
  columnWidth?: number;
  /** Whether to show grid lines */
  showGrid?: boolean;
  /** Whether to highlight today's date */
  showToday?: boolean;
  /** Custom date format for headers */
  dateFormat?: string;
  /** Whether to show task dependencies as arrows */
  showDependencies?: boolean;
  /** Padding between task bars */
  barPadding?: number;
  /** Custom color for the grid */
  gridColor?: string;
  /** Custom color for today's indicator */
  todayColor?: string;
  /** Whether to enable project grouping */
  enableProjectGrouping?: boolean;
  /** Height of project header rows in pixels */
  projectHeaderHeight?: number;
  /** Size of milestone diamonds in pixels */
  milestoneSize?: number;
  /** Whether to show milestone labels */
  showMilestoneLabels?: boolean;
  /** Whether to allow editing task duration (resizing) */
  editDuration?: boolean;
  /** Whether to allow editing task position (moving) */
  editPosition?: boolean;
  /** Whether to hide dependency arrows when source or target is not visible (collapsed) */
  hideOrphanDependencies?: boolean;
  /** Whether to enable swim lanes */
  enableSwimlanes?: boolean;
  /** Whether to show project summary bars in project headers */
  showProjectSummary?: boolean;
  /** Whether to show progress percentage as text on task bars */
  showTaskProgress?: boolean;
  /** Custom title for the sidebar header */
  sidebarTitle?: string;
  /** Whether to show tooltips with full task name on hover */
  showTooltips?: boolean;
}

/**
 * Internal representation of a task with calculated positions
 */
export interface RenderedTask extends GanttTask {
  x: number;
  y: number;
  width: number;
  isVisible?: boolean;
  row?: number; // For swim lane packing
}

/**
 * Internal representation of a milestone with calculated position
 */
export interface RenderedMilestone extends GanttMilestone {
  x: number;
  y: number;
  isVisible?: boolean;
}

/**
 * Internal representation of a project with state
 */
export interface RenderedProject extends GanttProject {
  isExpanded: boolean;
  taskCount: number;
  y: number;
  height: number;
  start?: Date;
  end?: Date;
  x?: number;
  width?: number;
}

/**
 * Internal representation of a swim lane with state
 */
export interface RenderedSwimlane extends GanttSwimlane {
  y: number;
  height: number;
  rowCount: number;
}

/**
 * Represents a time column in the chart
 */
export interface TimeColumn {
  date: Date;
  label: string;
  x: number;
  primaryLabel?: string;
  secondaryLabel?: string;
  width?: number;
  isPrimaryStart?: boolean;
}

/**
 * Props for the GanttChart component
 */
export interface GanttChartProps {
  tasks: GanttTask[];
  milestones?: GanttMilestone[];
  projects?: GanttProject[];
  swimlanes?: GanttSwimlane[];
  options?: GanttOptions;
}
