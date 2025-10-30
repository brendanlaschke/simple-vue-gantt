import { computed, type ComputedRef, ref, type Ref } from "vue";
import type {
  GanttTask,
  GanttMilestone,
  GanttProject,
  GanttSwimlane,
  GanttOptions,
  RenderedTask,
  RenderedMilestone,
  RenderedProject,
  RenderedSwimlane,
  TimeColumn,
  ViewMode,
} from "@/types";
import { getColumnCount, getColumnDate } from "@/utils/columnCalculations";
import { isPrimaryPeriodStart } from "@/utils/dateComparison";
import { getDaysDiff, getHoursDiff, getMonthsDiff, getYearsDiff } from "@/utils/dateDifference";
import { formatDate, formatPrimaryLabel, formatSecondaryLabel } from "@/utils/dateFormatting";
import { startOfDay, startOfHour, startOfWeek, startOfMonth, startOfYear } from "@/utils/dateNormalization";
import { packTasksIntoRows } from "@/utils/swimlanePacking";


export interface UseGanttChartReturn {
  chartStartDate: ComputedRef<Date>;
  chartEndDate: ComputedRef<Date>;
  timeColumns: ComputedRef<TimeColumn[]>;
  renderedTasks: ComputedRef<RenderedTask[]>;
  renderedMilestones: ComputedRef<RenderedMilestone[]>;
  renderedProjects: ComputedRef<RenderedProject[]>;
  renderedSwimlanes: ComputedRef<RenderedSwimlane[]>;
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
  enableSwimlanes: false,
  swimlaneHeight: 80,
  showTaskNameInBar: false,
};

export function useGanttChart(
  tasks: ComputedRef<GanttTask[]>,
  milestones: ComputedRef<GanttMilestone[]>,
  projects: ComputedRef<GanttProject[]>,
  swimlanes: ComputedRef<GanttSwimlane[]>,
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
   * Generate rendered swimlanes with calculated heights
   */
  const renderedSwimlanes = computed<RenderedSwimlane[]>(() => {
    if (!mergedOptions.value.enableSwimlanes) {
      return [];
    }

    let currentY = 0;
    
    // If project grouping is enabled, swimlanes are organized within projects
    if (mergedOptions.value.enableProjectGrouping) {
      const allSwimlanes: RenderedSwimlane[] = [];
      
      projects.value.forEach((project) => {
        const isExpanded = projectStates.value.get(project.id) ?? true;
        
        // Add space for project header
        currentY += mergedOptions.value.projectHeaderHeight;
        
        if (isExpanded) {
          // Process each swimlane within this project
          swimlanes.value.forEach((swimlane) => {
            const projectSwimlaneTasks = tasks.value.filter(
              (t) => t.projectId === project.id && t.swimlaneId === swimlane.id
            );

            if (projectSwimlaneTasks.length === 0) return; // Skip empty swimlanes

            // Calculate positions for packing
            const tasksWithPositions = projectSwimlaneTasks.map((task) => {
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

              return { id: task.id, x: Math.max(0, x), width: Math.max(columnWidth.value / 2, width) };
            });

            // Pack tasks into rows
            const taskRows = packTasksIntoRows(tasksWithPositions, barPadding.value);
            const rowCount = Math.max(1, ...Array.from(taskRows.values()).map(r => r + 1));
            const swimlaneHeight = rowCount * (barHeight.value + barPadding.value);

            allSwimlanes.push({
              ...swimlane,
              id: `${project.id}-${swimlane.id}`, // Unique ID for project+swimlane combo
              y: currentY,
              height: swimlaneHeight,
              rowCount,
            });

            currentY += swimlaneHeight;
          });
        }
      });
      
      // Handle orphan tasks (no project) grouped by swimlane
      swimlanes.value.forEach((swimlane) => {
        const orphanSwimlaneTasks = tasks.value.filter(
          (t) => !t.projectId && t.swimlaneId === swimlane.id
        );
        
        if (orphanSwimlaneTasks.length === 0) return;

        const tasksWithPositions = orphanSwimlaneTasks.map((task) => {
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

          return { id: task.id, x: Math.max(0, x), width: Math.max(columnWidth.value / 2, width) };
        });

        const taskRows = packTasksIntoRows(tasksWithPositions, barPadding.value);
        const rowCount = Math.max(1, ...Array.from(taskRows.values()).map(r => r + 1));
        const swimlaneHeight = rowCount * (barHeight.value + barPadding.value);

        allSwimlanes.push({
          ...swimlane,
          y: currentY,
          height: swimlaneHeight,
          rowCount,
        });

        currentY += swimlaneHeight;
      });
      
      return allSwimlanes;
    }

    // Swimlanes without project grouping
    return swimlanes.value.map((swimlane) => {
      const swimlaneTasks = tasks.value.filter(
        (t) => t.swimlaneId === swimlane.id
      );

      // Calculate basic positions to determine packing
      const tasksWithPositions = swimlaneTasks.map((task) => {
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

        return { id: task.id, x: Math.max(0, x), width: Math.max(columnWidth.value / 2, width) };
      });

      // Pack tasks into rows
      const taskRows = packTasksIntoRows(tasksWithPositions, barPadding.value);
      const rowCount = Math.max(1, ...Array.from(taskRows.values()).map(r => r + 1));

      const swimlaneHeight = rowCount * (barHeight.value + barPadding.value);

      const rendered: RenderedSwimlane = {
        ...swimlane,
        y: currentY,
        height: swimlaneHeight,
        rowCount,
      };

      currentY += swimlaneHeight;

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
    // Swim lane mode with project grouping - pack tasks into swim lanes within projects
    if (mergedOptions.value.enableSwimlanes && mergedOptions.value.enableProjectGrouping) {
      const rendered: RenderedTask[] = [];
      
      projects.value.forEach((project) => {
        const isExpanded = projectStates.value.get(project.id) ?? true;
        
        if (isExpanded) {
          swimlanes.value.forEach((swimlane) => {
            const projectSwimlaneTasks = tasks.value.filter(
              (t) => t.projectId === project.id && t.swimlaneId === swimlane.id
            );
            
            if (projectSwimlaneTasks.length === 0) return;

            // Find the rendered swimlane for this project+swimlane combo
            const renderedSwimlane = renderedSwimlanes.value.find(
              (rs) => rs.id === `${project.id}-${swimlane.id}`
            );
            
            if (!renderedSwimlane) return;

            // Calculate positions and pack into rows
            const tasksWithPositions: Array<{ task: GanttTask; x: number; width: number }> = [];
            
            projectSwimlaneTasks.forEach((task) => {
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

              tasksWithPositions.push({
                task,
                x: Math.max(0, x),
                width: Math.max(columnWidth.value / 2, width)
              });
            });

            // Pack tasks into rows
            const taskPositions = tasksWithPositions.map(st => ({ id: st.task.id, x: st.x, width: st.width }));
            const taskToRow = packTasksIntoRows(taskPositions, barPadding.value);

            tasksWithPositions.forEach(({ task, x, width }) => {
              const row = taskToRow.get(task.id) || 0;
              const y = renderedSwimlane.y + row * (barHeight.value + barPadding.value);

              rendered.push({
                ...task,
                x,
                y,
                width,
                row,
                isVisible: true,
              });
            });
          });
        } else {
          // Project is collapsed - mark all tasks as not visible
          const projectTasks = tasks.value.filter((t) => t.projectId === project.id);
          projectTasks.forEach((task) => {
            rendered.push({
              ...task,
              x: 0,
              y: 0,
              width: 0,
              isVisible: false,
            });
          });
        }
      });

      // Handle orphan tasks grouped by swimlane
      swimlanes.value.forEach((swimlane) => {
        const orphanSwimlaneTasks = tasks.value.filter(
          (t) => !t.projectId && t.swimlaneId === swimlane.id
        );
        
        if (orphanSwimlaneTasks.length === 0) return;

        const renderedSwimlane = renderedSwimlanes.value.find((rs) => rs.id === swimlane.id);
        if (!renderedSwimlane) return;

        const tasksWithPositions: Array<{ task: GanttTask; x: number; width: number }> = [];
        
        orphanSwimlaneTasks.forEach((task) => {
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

          tasksWithPositions.push({
            task,
            x: Math.max(0, x),
            width: Math.max(columnWidth.value / 2, width)
          });
        });

        const taskPositions = tasksWithPositions.map(st => ({ id: st.task.id, x: st.x, width: st.width }));
        const taskToRow = packTasksIntoRows(taskPositions, barPadding.value);

        tasksWithPositions.forEach(({ task, x, width }) => {
          const row = taskToRow.get(task.id) || 0;
          const y = renderedSwimlane.y + row * (barHeight.value + barPadding.value);

          rendered.push({
            ...task,
            x,
            y,
            width,
            row,
            isVisible: true,
          });
        });
      });

      return rendered;
    }

    // Swim lane mode - pack tasks into swim lanes
    if (mergedOptions.value.enableSwimlanes) {
      const rendered: RenderedTask[] = [];

      // First, group tasks by swimlane and calculate their x positions
      const tasksBySwimlane: Map<string, Array<{ task: GanttTask; x: number; width: number }>> = new Map();
      
      tasks.value.forEach((task) => {
        const swimlaneId = task.swimlaneId || 'default';
        if (!tasksBySwimlane.has(swimlaneId)) {
          tasksBySwimlane.set(swimlaneId, []);
        }

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

        tasksBySwimlane.get(swimlaneId)!.push({
          task,
          x: Math.max(0, x),
          width: Math.max(columnWidth.value / 2, width)
        });
      });

      // Now render tasks for each swimlane
      renderedSwimlanes.value.forEach((swimlane) => {
        const swimlaneTasks = tasksBySwimlane.get(swimlane.id) || [];
        
        // Pack tasks into rows
        const taskPositions = swimlaneTasks.map(st => ({ id: st.task.id, x: st.x, width: st.width }));
        const taskToRow = packTasksIntoRows(taskPositions, barPadding.value);

        swimlaneTasks.forEach(({ task, x, width }) => {
          const row = taskToRow.get(task.id) || 0;
          const y = swimlane.y + row * (barHeight.value + barPadding.value);

          rendered.push({
            ...task,
            x,
            y,
            width,
            row,
            isVisible: true,
          });
        });
      });

      return rendered;
    }

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
    if (mergedOptions.value.enableSwimlanes && mergedOptions.value.enableProjectGrouping) {
      // Combined mode: sum project headers + swimlane heights
      let height = 0;
      projects.value.forEach((project) => {
        const isExpanded = projectStates.value.get(project.id) ?? true;
        height += mergedOptions.value.projectHeaderHeight;
        
        if (isExpanded) {
          // Add heights of swimlanes within this project
          swimlanes.value.forEach((swimlane) => {
            const renderedSwimlane = renderedSwimlanes.value.find(
              (rs) => rs.id === `${project.id}-${swimlane.id}`
            );
            if (renderedSwimlane) {
              height += renderedSwimlane.height;
            }
          });
        }
      });
      
      // Add orphan swimlanes
      swimlanes.value.forEach((swimlane) => {
        const renderedSwimlane = renderedSwimlanes.value.find((rs) => rs.id === swimlane.id);
        if (renderedSwimlane) {
          height += renderedSwimlane.height;
        }
      });
      
      return height;
    }
    
    if (mergedOptions.value.enableSwimlanes) {
      // Swimlane-only mode: sum up all swimlane heights
      return renderedSwimlanes.value.reduce((total, swimlane) => total + swimlane.height, 0);
    }

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
    renderedSwimlanes,
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
