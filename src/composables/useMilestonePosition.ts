import type { ComputedRef } from "vue";
import type { GanttMilestone, ViewMode } from "@/types";
import { getDaysDiff, getHoursDiff, getMonthsDiff, getYearsDiff } from "@/utils/dateDifference";

/**
 * Calculate milestone position based on view mode
 */
export function useMilestonePosition(
  chartStartDate: ComputedRef<Date>,
  viewMode: ComputedRef<ViewMode>,
  columnWidth: ComputedRef<number>
) {
  /**
   * Calculate X position for a milestone
   */
  const calculateMilestonePosition = (milestone: GanttMilestone): number => {
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

    return Math.max(0, x);
  };

  return {
    calculateMilestonePosition,
  };
}
