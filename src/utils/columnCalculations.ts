import type { ViewMode } from "@/types";
import { getDaysDiff, getMinutesDiff } from "./dateDifference";
import { addDays, addHours, addMinutes, addMonths, addYears } from "./dateManipulation";

/**
 * Timeline column calculation utilities
 */

/**
 * Get the number of columns needed based on view mode
 */
export function getColumnCount(start: Date, end: Date, viewMode: ViewMode): number {
  switch (viewMode) {
    case "10min": {
      const minutes = getMinutesDiff(start, end);
      return Math.ceil(minutes / 10) + 1;
    }
    case "15min": {
      const minutes = getMinutesDiff(start, end);
      return Math.ceil(minutes / 15) + 1;
    }
    case "hour": {
      const msPerHour = 1000 * 60 * 60;
      return Math.ceil((end.getTime() - start.getTime()) / msPerHour) + 1;
    }
    case "day":
      return getDaysDiff(start, end) + 1;
    case "week":
      return Math.ceil(getDaysDiff(start, end) / 7);
    case "month": {
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return months + 1;
    }
    case "year": {
      return end.getFullYear() - start.getFullYear() + 1;
    }
    default:
      return 0;
  }
}

/**
 * Get the column date for a given index based on view mode
 */
export function getColumnDate(startDate: Date, index: number, viewMode: ViewMode): Date {
  switch (viewMode) {
    case "10min":
      return addMinutes(startDate, index * 10);
    case "15min":
      return addMinutes(startDate, index * 15);
    case "hour":
      return addHours(startDate, index);
    case "day":
      return addDays(startDate, index);
    case "week":
      return addDays(startDate, index * 7);
    case "month":
      return addMonths(startDate, index);
    case "year":
      return addYears(startDate, index);
    default:
      return startDate;
  }
}
