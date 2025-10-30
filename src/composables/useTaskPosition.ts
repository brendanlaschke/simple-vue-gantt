import type { ComputedRef } from "vue";
import type { GanttTask, ViewMode } from "@/types";
import { getDaysDiff, getHoursDiff, getMonthsDiff, getYearsDiff } from "@/utils/dateDifference";

/**
 * Calculate task position and width based on view mode
 */
export function useTaskPosition(
  chartStartDate: ComputedRef<Date>,
  viewMode: ComputedRef<ViewMode>,
  columnWidth: ComputedRef<number>
) {
  /**
   * Calculate X position and width for a task
   */
  const calculateTaskDimensions = (task: GanttTask): { x: number; width: number } => {
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
      x: Math.max(0, x),
      width: Math.max(columnWidth.value / 2, width),
    };
  };

  return {
    calculateTaskDimensions,
  };
}
