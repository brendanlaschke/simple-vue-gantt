import { computed, type ComputedRef, ref, type Ref } from "vue";
import type {
  GanttTask,
  GanttMilestone,
  GanttProject,
  GanttOptions,
  RenderedTask,
  RenderedMilestone,
  RenderedProject,
  TimeColumn,
  ViewMode,
} from "@/types";
import { getColumnCount, getColumnDate } from "@/utils/columnCalculations";
import { isPrimaryPeriodStart } from "@/utils/dateComparison";
import { getDaysDiff } from "@/utils/dateDifference";
import { formatDate, formatPrimaryLabel, formatSecondaryLabel } from "@/utils/dateFormatting";
import { startOfDay, startOfHour, startOfWeek, startOfMonth, startOfYear } from "@/utils/dateNormalization";


export interface UseGanttChartReturn {
  chartStartDate: ComputedRef<Date>;
  chartEndDate: ComputedRef<Date>;
  timeColumns: ComputedRef<TimeColumn[]>;
  renderedTasks: ComputedRef<RenderedTask[]>;
  renderedMilestones: ComputedRef<RenderedMilestone[]>;
  renderedProjects: ComputedRef<RenderedProject[]>;
  chartWidth: ComputedRef<number>;
  chartHeight: ComputedRef<number>;
  toggleProject: (projectId: string) => void;
  projectStates: Ref<Map<string, boolean>>;
}

const DEFAULT_OPTIONS: Required<GanttOptions> = {
  viewMode: "day",
  barHeight: 30,
  columnWidth: 40,
  showGrid: true,
  showToday: true,
  dateFormat: "short",
  showDependencies: true,
  barPadding: 4,
  gridColor: "#e5e7eb",
  todayColor: "#ef4444",
  enableProjectGrouping: false,
  projectHeaderHeight: 35,
  milestoneSize: 16,
  showMilestoneLabels: true,
  editDuration: true,
  editPosition: true,
  hideOrphanDependencies: true,
};

export function useGanttChart(
  tasks: ComputedRef<GanttTask[]>,
  milestones: ComputedRef<GanttMilestone[]>,
  projects: ComputedRef<GanttProject[]>,
  options: ComputedRef<GanttOptions>
): UseGanttChartReturn {
  const projectStates = ref<Map<string, boolean>>(new Map());

  const mergedOptions = computed<Required<GanttOptions>>(() => ({
    ...DEFAULT_OPTIONS,
    ...options.value,
  }));

  const viewMode = computed(() => mergedOptions.value.viewMode);
  const columnWidth = computed(() => mergedOptions.value.columnWidth);
  const barHeight = computed(() => mergedOptions.value.barHeight);
  const barPadding = computed(() => mergedOptions.value.barPadding);

  /**
   * Calculate the start date for the chart timeline
   */
  const chartStartDate = computed<Date>(() => {
    if (tasks.value.length === 0) {
      return startOfDay(new Date());
    }

    const minDate = tasks.value.reduce((min: Date, task: GanttTask) => {
      return task.start < min ? task.start : min;
    }, tasks.value[0].start);

    return getViewModeStartDate(minDate, viewMode.value);
  });

  /**
   * Calculate the end date for the chart timeline
   */
  const chartEndDate = computed<Date>(() => {
    if (tasks.value.length === 0) {
      return startOfDay(new Date());
    }

    const maxDate = tasks.value.reduce((max: Date, task: GanttTask) => {
      return task.end > max ? task.end : max;
    }, tasks.value[0].end);

    return maxDate;
  });

  /**
   * Initialize project states - all expanded by default
   */
  const initializeProjectStates = () => {
    projects.value.forEach((project) => {
      if (!projectStates.value.has(project.id)) {
        projectStates.value.set(project.id, true);
      }
    });
  };

  // Initialize on first run
  if (mergedOptions.value.enableProjectGrouping) {
    initializeProjectStates();
  }

  /**
   * Toggle project expanded/collapsed state
   */
  const toggleProject = (projectId: string) => {
    const currentState = projectStates.value.get(projectId) ?? true;
    projectStates.value.set(projectId, !currentState);
  };

  /**
   * Generate rendered projects with state
   */
  const renderedProjects = computed<RenderedProject[]>(() => {
    if (!mergedOptions.value.enableProjectGrouping) {
      return [];
    }

    let currentY = 0;
    return projects.value.map((project) => {
      const taskCount = tasks.value.filter(
        (t) => t.projectId === project.id
      ).length;
      const isExpanded = projectStates.value.get(project.id) ?? true;

      const rendered: RenderedProject = {
        ...project,
        isExpanded,
        taskCount,
        y: currentY,
      };

      currentY += mergedOptions.value.projectHeaderHeight;
      if (isExpanded) {
        currentY += taskCount * (barHeight.value + barPadding.value);
      }

      return rendered;
    });
  });

  /**
   * Generate time columns for the chart header
   */
  const timeColumns = computed<TimeColumn[]>(() => {
    const columns: TimeColumn[] = [];
    const columnCount = getColumnCount(
      chartStartDate.value,
      chartEndDate.value,
      viewMode.value
    );

    for (let i = 0; i < columnCount; i++) {
      const date = getColumnDate(chartStartDate.value, i, viewMode.value);
      const isPrimaryStart = isPrimaryPeriodStart(date, viewMode.value);
      
      columns.push({
        date,
        label: formatDate(date, viewMode.value),
        x: i * columnWidth.value,
        primaryLabel: formatPrimaryLabel(date, viewMode.value),
        secondaryLabel: formatSecondaryLabel(date, viewMode.value),
        width: columnWidth.value,
        isPrimaryStart,
      });
    }

    return columns;
  });

  /**
   * Calculate task positions and dimensions
   */
  const renderedTasks = computed<RenderedTask[]>(() => {
    if (!mergedOptions.value.enableProjectGrouping) {
      // Simple mode - no project grouping
      return tasks.value.map((task: GanttTask, index: number) => {
        const startDiff = getDaysDiff(chartStartDate.value, task.start);
        const duration = getDaysDiff(task.start, task.end);

        let x: number;
        let width: number;

        switch (viewMode.value) {
          case "hour": {
            const startHours = getHoursDiff(chartStartDate.value, task.start);
            const durationHours = getHoursDiff(task.start, task.end);
            x = startHours * columnWidth.value;
            width = durationHours * columnWidth.value;
            break;
          }
          case "day":
            x = startDiff * columnWidth.value;
            width = duration * columnWidth.value;
            break;
          case "week":
            x = (startDiff / 7) * columnWidth.value;
            width = (duration / 7) * columnWidth.value;
            break;
          case "month": {
            const startMonths = getMonthsDiff(chartStartDate.value, task.start);
            const durationMonths = getMonthsDiff(task.start, task.end);
            x = startMonths * columnWidth.value;
            width = durationMonths * columnWidth.value;
            break;
          }
          case "year": {
            const startYears = getYearsDiff(chartStartDate.value, task.start);
            const durationYears = getYearsDiff(task.start, task.end);
            x = startYears * columnWidth.value;
            width = durationYears * columnWidth.value;
            break;
          }
          default:
            x = 0;
            width = 0;
        }

        return {
          ...task,
          x: Math.max(0, x),
          y: index * (barHeight.value + barPadding.value),
          width: Math.max(columnWidth.value / 2, width),
          isVisible: true,
        };
      });
    }

    // Project grouping mode
    const rendered: RenderedTask[] = [];
    let currentY = 0;

    projects.value.forEach((project) => {
      const projectTasks = tasks.value.filter(
        (t) => t.projectId === project.id
      );
      const isExpanded = projectStates.value.get(project.id) ?? true;

      // Add space for project header
      currentY += mergedOptions.value.projectHeaderHeight;

      projectTasks.forEach((task: GanttTask) => {
        const startDiff = getDaysDiff(chartStartDate.value, task.start);
        const duration = getDaysDiff(task.start, task.end);

        let x: number;
        let width: number;

        switch (viewMode.value) {
          case "hour": {
            const startHours = getHoursDiff(chartStartDate.value, task.start);
            const durationHours = getHoursDiff(task.start, task.end);
            x = startHours * columnWidth.value;
            width = durationHours * columnWidth.value;
            break;
          }
          case "day":
            x = startDiff * columnWidth.value;
            width = duration * columnWidth.value;
            break;
          case "week":
            x = (startDiff / 7) * columnWidth.value;
            width = (duration / 7) * columnWidth.value;
            break;
          case "month": {
            const startMonths = getMonthsDiff(chartStartDate.value, task.start);
            const durationMonths = getMonthsDiff(task.start, task.end);
            x = startMonths * columnWidth.value;
            width = durationMonths * columnWidth.value;
            break;
          }
          case "year": {
            const startYears = getYearsDiff(chartStartDate.value, task.start);
            const durationYears = getYearsDiff(task.start, task.end);
            x = startYears * columnWidth.value;
            width = durationYears * columnWidth.value;
            break;
          }
          default:
            x = 0;
            width = 0;
        }

        rendered.push({
          ...task,
          x: Math.max(0, x),
          y: currentY,
          width: Math.max(columnWidth.value / 2, width),
          isVisible: isExpanded,
        });

        if (isExpanded) {
          currentY += barHeight.value + barPadding.value;
        }
      });

      // Move to next project
      if (!isExpanded && projectTasks.length > 0) {
        // Tasks are collapsed, don't add their height
      }
    });

    // Handle tasks without a project
    const orphanTasks = tasks.value.filter((t) => !t.projectId);
    orphanTasks.forEach((task: GanttTask) => {
      const startDiff = getDaysDiff(chartStartDate.value, task.start);
      const duration = getDaysDiff(task.start, task.end);

      let x: number;
      let width: number;

      switch (viewMode.value) {
        case "hour": {
          const startHours = getHoursDiff(chartStartDate.value, task.start);
          const durationHours = getHoursDiff(task.start, task.end);
          x = startHours * columnWidth.value;
          width = durationHours * columnWidth.value;
          break;
        }
        case "day":
          x = startDiff * columnWidth.value;
          width = duration * columnWidth.value;
          break;
        case "week":
          x = (startDiff / 7) * columnWidth.value;
          width = (duration / 7) * columnWidth.value;
          break;
        case "month": {
          const startMonths = getMonthsDiff(chartStartDate.value, task.start);
          const durationMonths = getMonthsDiff(task.start, task.end);
          x = startMonths * columnWidth.value;
          width = durationMonths * columnWidth.value;
          break;
        }
        case "year": {
          const startYears = getYearsDiff(chartStartDate.value, task.start);
          const durationYears = getYearsDiff(task.start, task.end);
          x = startYears * columnWidth.value;
          width = durationYears * columnWidth.value;
          break;
        }
        default:
          x = 0;
          width = 0;
      }

      rendered.push({
        ...task,
        x: Math.max(0, x),
        y: currentY,
        width: Math.max(columnWidth.value / 2, width),
        isVisible: true,
      });

      currentY += barHeight.value + barPadding.value;
    });

    return rendered;
  });

  /**
   * Calculate milestone positions
   */
  const renderedMilestones = computed<RenderedMilestone[]>(() => {
    if (!mergedOptions.value.enableProjectGrouping) {
      // Simple mode - position milestones based on their index
      return milestones.value.map(
        (milestone: GanttMilestone, index: number) => {
          const daysDiff = getDaysDiff(chartStartDate.value, milestone.date);

          let x: number;
          switch (viewMode.value) {
            case "hour": {
              const hours = getHoursDiff(chartStartDate.value, milestone.date);
              x = hours * columnWidth.value;
              break;
            }
            case "day":
              x = daysDiff * columnWidth.value;
              break;
            case "week":
              x = (daysDiff / 7) * columnWidth.value;
              break;
            case "month": {
              const months = getMonthsDiff(
                chartStartDate.value,
                milestone.date
              );
              x = months * columnWidth.value;
              break;
            }
            case "year": {
              const years = getYearsDiff(chartStartDate.value, milestone.date);
              x = years * columnWidth.value;
              break;
            }
            default:
              x = 0;
          }

          return {
            ...milestone,
            x: Math.max(0, x),
            y: index * (barHeight.value + barPadding.value),
            isVisible: true,
          };
        }
      );
    }

    // Project grouping mode
    const rendered: RenderedMilestone[] = [];
    let currentY = 0;

    projects.value.forEach((project) => {
      const projectMilestones = milestones.value.filter(
        (m) => m.projectId === project.id
      );
      const isExpanded = projectStates.value.get(project.id) ?? true;

      // Add space for project header
      currentY += mergedOptions.value.projectHeaderHeight;

      projectMilestones.forEach((milestone: GanttMilestone) => {
        const daysDiff = getDaysDiff(chartStartDate.value, milestone.date);

        let x: number;
        switch (viewMode.value) {
          case "hour": {
            const hours = getHoursDiff(chartStartDate.value, milestone.date);
            x = hours * columnWidth.value;
            break;
          }
          case "day":
            x = daysDiff * columnWidth.value;
            break;
          case "week":
            x = (daysDiff / 7) * columnWidth.value;
            break;
          case "month": {
            const months = getMonthsDiff(chartStartDate.value, milestone.date);
            x = months * columnWidth.value;
            break;
          }
          case "year": {
            const years = getYearsDiff(chartStartDate.value, milestone.date);
            x = years * columnWidth.value;
            break;
          }
          default:
            x = 0;
        }

        rendered.push({
          ...milestone,
          x: Math.max(0, x),
          y: currentY,
          isVisible: isExpanded,
        });

        if (isExpanded) {
          currentY += barHeight.value + barPadding.value;
        }
      });

      // Account for project tasks in height calculation
      const projectTasks = tasks.value.filter(
        (t) => t.projectId === project.id
      );
      if (isExpanded) {
        currentY += projectTasks.length * (barHeight.value + barPadding.value);
      }
    });

    // Handle orphan milestones (milestones without a project)
    const orphanMilestones = milestones.value.filter((m) => !m.projectId);
    orphanMilestones.forEach((milestone: GanttMilestone) => {
      const daysDiff = getDaysDiff(chartStartDate.value, milestone.date);

      let x: number;
      switch (viewMode.value) {
        case "hour": {
          const hours = getHoursDiff(chartStartDate.value, milestone.date);
          x = hours * columnWidth.value;
          break;
        }
        case "day":
          x = daysDiff * columnWidth.value;
          break;
        case "week":
          x = (daysDiff / 7) * columnWidth.value;
          break;
        case "month": {
          const months = getMonthsDiff(chartStartDate.value, milestone.date);
          x = months * columnWidth.value;
          break;
        }
        case "year": {
          const years = getYearsDiff(chartStartDate.value, milestone.date);
          x = years * columnWidth.value;
          break;
        }
        default:
          x = 0;
      }

      rendered.push({
        ...milestone,
        x: Math.max(0, x),
        y: currentY,
        isVisible: true,
      });

      currentY += barHeight.value + barPadding.value;
    });

    return rendered;
  });

  /**
   * Calculate total chart width
   */
  const chartWidth = computed<number>(() => {
    const columnCount = getColumnCount(
      chartStartDate.value,
      chartEndDate.value,
      viewMode.value
    );
    return columnCount * columnWidth.value;
  });

  /**
   * Calculate total chart height
   */
  const chartHeight = computed<number>(() => {
    if (!mergedOptions.value.enableProjectGrouping) {
      return tasks.value.length * (barHeight.value + barPadding.value);
    }

    let height = 0;
    projects.value.forEach((project) => {
      const projectTasks = tasks.value.filter(
        (t) => t.projectId === project.id
      );
      const isExpanded = projectStates.value.get(project.id) ?? true;

      height += mergedOptions.value.projectHeaderHeight;
      if (isExpanded) {
        height += projectTasks.length * (barHeight.value + barPadding.value);
      }
    });

    // Add orphan tasks
    const orphanTasks = tasks.value.filter((t) => !t.projectId);
    height += orphanTasks.length * (barHeight.value + barPadding.value);

    return height;
  });

  return {
    chartStartDate,
    chartEndDate,
    timeColumns,
    renderedTasks,
    renderedMilestones,
    renderedProjects,
    chartWidth,
    chartHeight,
    toggleProject,
    projectStates,
  };
}

/**
 * Get the start date aligned to the view mode
 */
function getViewModeStartDate(date: Date, viewMode: ViewMode): Date {
  switch (viewMode) {
    case "hour":
      return startOfHour(date);
    case "day":
      return startOfDay(date);
    case "week":
      return startOfWeek(date);
    case "month":
      return startOfMonth(date);
    case "year":
      return startOfYear(date);
    default:
      return date;
  }
}

/**
 * Get the difference in months between two dates
 */
function getMonthsDiff(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

/**
 * Get the difference in years between two dates
 */
function getYearsDiff(start: Date, end: Date): number {
  return end.getFullYear() - start.getFullYear();
}

/**
 * Get the difference in hours between two dates
 */
function getHoursDiff(start: Date, end: Date): number {
  const msPerHour = 1000 * 60 * 60;
  return Math.round((end.getTime() - start.getTime()) / msPerHour);
}
