import { computed, type ComputedRef } from "vue";
import type { TimeColumn, ViewMode } from "@/types";
import {
  getColumnCount,
  getColumnDate,
  formatDate,
  formatPrimaryLabel,
  formatSecondaryLabel,
  isPrimaryPeriodStart,
} from "@/utils/date";

/**
 * Generate time columns for the chart timeline
 */
export function useTimeColumns(
  chartStartDate: ComputedRef<Date>,
  chartEndDate: ComputedRef<Date>,
  viewMode: ComputedRef<ViewMode>,
  columnWidth: ComputedRef<number>
) {
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

  return {
    timeColumns,
  };
}
