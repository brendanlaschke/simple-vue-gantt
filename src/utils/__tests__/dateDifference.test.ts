import { describe, it, expect } from "vitest";
import { getDaysDiff, getHoursDiff, getMonthsDiff, getYearsDiff } from "../dateDifference";

describe("dateDifference", () => {
  describe("getDaysDiff", () => {
    it("should calculate difference in days between two dates", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-05");
      expect(getDaysDiff(start, end)).toBe(4);
    });

    it("should return 0 for same date", () => {
      const date = new Date("2024-01-01");
      expect(getDaysDiff(date, date)).toBe(0);
    });

    it("should handle negative differences", () => {
      const start = new Date("2024-01-05");
      const end = new Date("2024-01-01");
      expect(getDaysDiff(start, end)).toBe(-4);
    });

    it("should handle dates across months", () => {
      const start = new Date("2024-01-30");
      const end = new Date("2024-02-02");
      expect(getDaysDiff(start, end)).toBe(3);
    });

    it("should handle dates across years", () => {
      const start = new Date("2023-12-30");
      const end = new Date("2024-01-03");
      expect(getDaysDiff(start, end)).toBe(4);
    });

    it("should ignore time component", () => {
      const start = new Date("2024-01-01T10:30:00");
      const end = new Date("2024-01-02T14:45:00");
      expect(getDaysDiff(start, end)).toBe(1);
    });
  });

  describe("getHoursDiff", () => {
    it("should calculate difference in hours between two dates", () => {
      const start = new Date("2024-01-01T10:00:00");
      const end = new Date("2024-01-01T15:00:00");
      expect(getHoursDiff(start, end)).toBe(5);
    });

    it("should return 0 for same time", () => {
      const date = new Date("2024-01-01T10:00:00");
      expect(getHoursDiff(date, date)).toBe(0);
    });

    it("should handle negative differences", () => {
      const start = new Date("2024-01-01T15:00:00");
      const end = new Date("2024-01-01T10:00:00");
      expect(getHoursDiff(start, end)).toBe(-5);
    });

    it("should handle hours across days", () => {
      const start = new Date("2024-01-01T22:00:00");
      const end = new Date("2024-01-02T02:00:00");
      expect(getHoursDiff(start, end)).toBe(4);
    });

    it("should round to nearest hour", () => {
      const start = new Date("2024-01-01T10:00:00");
      const end = new Date("2024-01-01T10:40:00");
      expect(getHoursDiff(start, end)).toBe(1); // 40 minutes rounds to 1 hour
    });
  });

  describe("getMonthsDiff", () => {
    it("should calculate difference in months between two dates", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-05-01");
      expect(getMonthsDiff(start, end)).toBe(4);
    });

    it("should return 0 for same month", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-31");
      expect(getMonthsDiff(start, end)).toBe(0);
    });

    it("should handle months across years", () => {
      const start = new Date("2023-11-01");
      const end = new Date("2024-02-01");
      expect(getMonthsDiff(start, end)).toBe(3);
    });

    it("should handle negative differences", () => {
      const start = new Date("2024-05-01");
      const end = new Date("2024-01-01");
      expect(getMonthsDiff(start, end)).toBe(-4);
    });

    it("should handle multiple years", () => {
      const start = new Date("2022-01-01");
      const end = new Date("2024-01-01");
      expect(getMonthsDiff(start, end)).toBe(24);
    });
  });

  describe("getYearsDiff", () => {
    it("should calculate difference in years between two dates", () => {
      const start = new Date("2020-01-01");
      const end = new Date("2024-01-01");
      expect(getYearsDiff(start, end)).toBe(4);
    });

    it("should return 0 for same year", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-12-31");
      expect(getYearsDiff(start, end)).toBe(0);
    });

    it("should handle negative differences", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2020-01-01");
      expect(getYearsDiff(start, end)).toBe(-4);
    });

    it("should ignore month and day", () => {
      const start = new Date("2020-12-31");
      const end = new Date("2021-01-01");
      expect(getYearsDiff(start, end)).toBe(1);
    });
  });
});
