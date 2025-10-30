import type { ViewMode } from "@/types";

/**
 * Date comparison and validation utilities
 */

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Check if a date is the start of a primary period for the given view mode
 */
export function isPrimaryPeriodStart(date: Date, viewMode: ViewMode): boolean {
  switch (viewMode) {
    case "hour":
      // Start of a new day
      return date.getHours() === 0;
    case "day":
      // Start of a new month
      return date.getDate() === 1;
    case "week":
      // Start of a new year (first week of the year)
      return date.getMonth() === 0 && date.getDate() <= 7;
    case "month":
      // Start of a new year
      return date.getMonth() === 0;
    case "year":
    default:
      return false;
  }
}
