/**
 * Date difference calculation utilities
 */

/**
 * Get the difference in days between two dates
 */
export function getDaysDiff(start: Date, end: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startTime = new Date(start).setHours(0, 0, 0, 0);
  const endTime = new Date(end).setHours(0, 0, 0, 0);
  return Math.round((endTime - startTime) / msPerDay);
}

/**
 * Get the difference in hours between two dates
 */
export function getHoursDiff(start: Date, end: Date): number {
  const msPerHour = 1000 * 60 * 60;
  return Math.round((end.getTime() - start.getTime()) / msPerHour);
}

/**
 * Get the difference in months between two dates
 */
export function getMonthsDiff(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

/**
 * Get the difference in years between two dates
 */
export function getYearsDiff(start: Date, end: Date): number {
  return end.getFullYear() - start.getFullYear();
}
