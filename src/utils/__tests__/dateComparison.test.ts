import { describe, it, expect } from "vitest";
import { isSameDay, isPrimaryPeriodStart } from "../dateComparison";

describe("dateComparison", () => {
  describe("isSameDay", () => {
    it("should return true for same day", () => {
      const date1 = new Date("2024-03-15T10:30:00");
      const date2 = new Date("2024-03-15T18:45:00");

      expect(isSameDay(date1, date2)).toBe(true);
    });

    it("should return false for different days", () => {
      const date1 = new Date("2024-03-15T10:30:00");
      const date2 = new Date("2024-03-16T10:30:00");

      expect(isSameDay(date1, date2)).toBe(false);
    });

    it("should return false for different months", () => {
      const date1 = new Date("2024-03-15T10:30:00");
      const date2 = new Date("2024-04-15T10:30:00");

      expect(isSameDay(date1, date2)).toBe(false);
    });

    it("should return false for different years", () => {
      const date1 = new Date("2024-03-15T10:30:00");
      const date2 = new Date("2023-03-15T10:30:00");

      expect(isSameDay(date1, date2)).toBe(false);
    });

    it("should handle dates at midnight", () => {
      const date1 = new Date("2024-03-15T00:00:00");
      const date2 = new Date("2024-03-15T23:59:59");

      expect(isSameDay(date1, date2)).toBe(true);
    });
  });

  describe("isPrimaryPeriodStart", () => {
    describe("hour view mode", () => {
      it("should return true for start of day (midnight)", () => {
        const date = new Date("2024-03-15T00:00:00");
        expect(isPrimaryPeriodStart(date, "hour")).toBe(true);
      });

      it("should return false for non-midnight hour", () => {
        const date = new Date("2024-03-15T10:00:00");
        expect(isPrimaryPeriodStart(date, "hour")).toBe(false);
      });
    });

    describe("day view mode", () => {
      it("should return true for start of month (1st day)", () => {
        const date = new Date("2024-03-01T00:00:00");
        expect(isPrimaryPeriodStart(date, "day")).toBe(true);
      });

      it("should return false for non-1st day", () => {
        const date = new Date("2024-03-15T00:00:00");
        expect(isPrimaryPeriodStart(date, "day")).toBe(false);
      });
    });

    describe("week view mode", () => {
      it("should return true for first week of year", () => {
        const date1 = new Date("2024-01-01T00:00:00");
        expect(isPrimaryPeriodStart(date1, "week")).toBe(true);

        const date2 = new Date("2024-01-07T00:00:00");
        expect(isPrimaryPeriodStart(date2, "week")).toBe(true);
      });

      it("should return false for first week but after 7th day", () => {
        const date = new Date("2024-01-08T00:00:00");
        expect(isPrimaryPeriodStart(date, "week")).toBe(false);
      });

      it("should return false for non-January weeks", () => {
        const date = new Date("2024-03-01T00:00:00");
        expect(isPrimaryPeriodStart(date, "week")).toBe(false);
      });
    });

    describe("month view mode", () => {
      it("should return true for start of year (January)", () => {
        const date = new Date("2024-01-15T00:00:00");
        expect(isPrimaryPeriodStart(date, "month")).toBe(true);
      });

      it("should return false for non-January months", () => {
        const date = new Date("2024-03-01T00:00:00");
        expect(isPrimaryPeriodStart(date, "month")).toBe(false);
      });
    });

    describe("year view mode", () => {
      it("should return false (no primary period for year mode)", () => {
        const date = new Date("2024-01-01T00:00:00");
        expect(isPrimaryPeriodStart(date, "year")).toBe(false);
      });
    });
  });
});
