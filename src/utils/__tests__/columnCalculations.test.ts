import { describe, it, expect } from "vitest";
import { getColumnCount, getColumnDate } from "../columnCalculations";

describe("columnCalculations", () => {
  describe("getColumnCount", () => {
    it("should calculate column count for day view", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-05");
      expect(getColumnCount(start, end, "day")).toBe(5); // Days 1-5 inclusive
    });

    it("should calculate column count for hour view", () => {
      const start = new Date("2024-01-01T08:00:00");
      const end = new Date("2024-01-01T12:00:00");
      expect(getColumnCount(start, end, "hour")).toBe(5); // Hours 8-12 inclusive
    });

    it("should calculate column count for week view", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-21"); // 3 weeks
      expect(getColumnCount(start, end, "week")).toBe(3);
    });

    it("should calculate column count for month view", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-05-01");
      expect(getColumnCount(start, end, "month")).toBe(5); // Jan-May inclusive
    });

    it("should calculate column count for year view", () => {
      const start = new Date("2020-01-01");
      const end = new Date("2024-01-01");
      expect(getColumnCount(start, end, "year")).toBe(5); // 2020-2024 inclusive
    });

    it("should handle same start and end date", () => {
      const date = new Date("2024-01-01");
      expect(getColumnCount(date, date, "day")).toBe(1);
    });

    it("should round up partial weeks", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-10"); // 9 days = 1.28 weeks
      expect(getColumnCount(start, end, "week")).toBe(2); // Should round up
    });

    it("should handle months across years", () => {
      const start = new Date("2023-11-01");
      const end = new Date("2024-02-01");
      expect(getColumnCount(start, end, "month")).toBe(4); // Nov, Dec, Jan, Feb
    });
  });

  describe("getColumnDate", () => {
    it("should get column date for day view", () => {
      const start = new Date("2024-01-01T12:00:00");
      const result = getColumnDate(start, 3, "day");

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(4); // 3 days after Jan 1
    });

    it("should get column date for hour view", () => {
      const start = new Date("2024-01-01T08:00:00");
      const result = getColumnDate(start, 5, "hour");

      expect(result.getHours()).toBe(13); // 5 hours after 8:00
    });

    it("should get column date for week view", () => {
      const start = new Date("2024-01-01");
      const result = getColumnDate(start, 2, "week");

      expect(result.getDate()).toBe(15); // 2 weeks (14 days) after Jan 1
    });

    it("should get column date for month view", () => {
      const start = new Date("2024-01-15");
      const result = getColumnDate(start, 3, "month");

      expect(result.getMonth()).toBe(3); // April (3 months after January)
      expect(result.getDate()).toBe(15);
    });

    it("should get column date for year view", () => {
      const start = new Date("2020-06-15");
      const result = getColumnDate(start, 4, "year");

      expect(result.getFullYear()).toBe(2024); // 4 years after 2020
      expect(result.getMonth()).toBe(5); // June
      expect(result.getDate()).toBe(15);
    });

    it("should return start date for index 0", () => {
      const start = new Date("2024-01-01T12:30:00");
      const result = getColumnDate(start, 0, "day");

      expect(result.getTime()).toBe(start.getTime());
    });

    it("should handle month transitions", () => {
      const start = new Date("2024-01-29");
      const result = getColumnDate(start, 5, "day");

      expect(result.getMonth()).toBe(1); // February
      expect(result.getDate()).toBe(3);
    });

    it("should handle year transitions", () => {
      const start = new Date("2023-12-29");
      const result = getColumnDate(start, 5, "day");

      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(3);
    });
  });
});
