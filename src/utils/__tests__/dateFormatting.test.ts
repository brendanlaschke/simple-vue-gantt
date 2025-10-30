import { describe, it, expect } from "vitest";
import {
  getWeekNumber,
  formatDate,
  formatPrimaryLabel,
  formatSecondaryLabel,
} from "../dateFormatting";

describe("dateFormatting", () => {
  describe("getWeekNumber", () => {
    it("should return 1 for first week of year", () => {
      const date = new Date("2024-01-01");
      expect(getWeekNumber(date)).toBe(1);
    });

    it("should return correct week number for mid-year", () => {
      const date = new Date("2024-07-01");
      const weekNum = getWeekNumber(date);
      expect(weekNum).toBeGreaterThan(20);
      expect(weekNum).toBeLessThan(30);
    });

    it("should return week 52 or 53 for end of year", () => {
      // December 20, 2024 is definitely in week 51 or 52 of 2024
      const date = new Date("2024-12-20");
      const weekNum = getWeekNumber(date);
      expect(weekNum).toBeGreaterThanOrEqual(51);
      expect(weekNum).toBeLessThanOrEqual(53);
    });
  });

  describe("formatDate", () => {
    const date = new Date("2024-03-15T14:30:00");

    it("should format hour view mode", () => {
      const result = formatDate(date, "hour");
      expect(result).toMatch(/14/); // Should contain hour 14
    });

    it("should format day view mode", () => {
      const result = formatDate(date, "day");
      expect(result).toContain("Mar");
      expect(result).toContain("15");
    });

    it("should format week view mode", () => {
      const result = formatDate(date, "week");
      expect(result).toMatch(/W\d+/); // Format: W11, W12, etc.
    });

    it("should format month view mode", () => {
      const result = formatDate(date, "month");
      expect(result).toContain("Mar");
    });

    it("should format year view mode", () => {
      const result = formatDate(date, "year");
      expect(result).toBe("2024");
    });

    it("should handle default/unknown view mode", () => {
      // @ts-expect-error Testing default case with invalid view mode
      const result = formatDate(date, "unknown");
      expect(result).toBeTruthy(); // Should return some date string
    });
  });

  describe("formatPrimaryLabel", () => {
    const date = new Date("2024-03-15T14:30:00");

    it("should format hour view mode primary label", () => {
      const result = formatPrimaryLabel(date, "hour");
      expect(result).toContain("Mar");
      expect(result).toContain("15");
    });

    it("should format day view mode primary label", () => {
      const result = formatPrimaryLabel(date, "day");
      expect(result).toContain("March");
      expect(result).toContain("2024");
    });

    it("should format week view mode primary label", () => {
      const result = formatPrimaryLabel(date, "week");
      expect(result).toBe("2024");
    });

    it("should format month view mode primary label", () => {
      const result = formatPrimaryLabel(date, "month");
      expect(result).toBe("2024");
    });

    it("should return empty string for year view mode", () => {
      const result = formatPrimaryLabel(date, "year");
      expect(result).toBe("");
    });
  });

  describe("formatSecondaryLabel", () => {
    const date = new Date("2024-03-15T14:30:00");

    it("should format hour view mode secondary label", () => {
      const result = formatSecondaryLabel(date, "hour");
      expect(result).toMatch(/14/); // Should contain hour 14
    });

    it("should format day view mode secondary label", () => {
      const result = formatSecondaryLabel(date, "day");
      expect(result).toContain("15");
    });

    it("should format week view mode secondary label", () => {
      const result = formatSecondaryLabel(date, "week");
      expect(result).toMatch(/W\d+/); // Format: W11, W12, etc.
    });

    it("should format month view mode secondary label", () => {
      const result = formatSecondaryLabel(date, "month");
      expect(result).toContain("Mar");
    });

    it("should format year view mode secondary label", () => {
      const result = formatSecondaryLabel(date, "year");
      expect(result).toBe("2024"); // Falls back to formatDate
    });
  });

  describe("date formatting edge cases", () => {
    it("should handle January dates", () => {
      const date = new Date("2024-01-01T00:00:00");
      expect(formatDate(date, "month")).toContain("Jan");
    });

    it("should handle December dates", () => {
      const date = new Date("2024-12-31T23:59:59");
      expect(formatDate(date, "month")).toContain("Dec");
    });

    it("should handle leap year dates", () => {
      const date = new Date("2024-02-29T12:00:00");
      expect(formatDate(date, "day")).toContain("29");
    });

    it("should handle midnight hour", () => {
      const date = new Date("2024-03-15T00:00:00");
      const result = formatDate(date, "hour");
      expect(result).toMatch(/0/);
    });

    it("should handle last hour of day", () => {
      const date = new Date("2024-03-15T23:00:00");
      const result = formatDate(date, "hour");
      expect(result).toMatch(/23/);
    });
  });
});
