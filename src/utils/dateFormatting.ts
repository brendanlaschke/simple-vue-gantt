import type { ViewMode } from "@/types";

/**
 * Date formatting utilities for Gantt chart display
 */

/**
 * Get the ISO week number for a date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Format a date based on view mode (single-row header)
 */
export function formatDate(date: Date, viewMode: ViewMode): string {
  switch (viewMode) {
    case "hour":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: false,
      });
    case "day":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "week":
      return `W${getWeekNumber(date)}`;
    case "month":
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    case "year":
      return date.getFullYear().toString();
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Format primary label for two-row header (top row - larger time unit)
 */
export function formatPrimaryLabel(date: Date, viewMode: ViewMode): string {
  switch (viewMode) {
    case "hour":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "day":
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    case "week":
      return date.getFullYear().toString();
    case "month":
      return date.getFullYear().toString();
    case "year":
    default:
      return "";
  }
}

/**
 * Format secondary label for two-row header (bottom row - smaller time unit)
 */
export function formatSecondaryLabel(date: Date, viewMode: ViewMode): string {
  switch (viewMode) {
    case "hour":
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: false,
      });
    case "day":
      return date.toLocaleDateString("en-US", {
        day: "numeric",
      });
    case "week":
      return `W${getWeekNumber(date)}`;
    case "month":
      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    case "year":
    default:
      return formatDate(date, viewMode);
  }
}
