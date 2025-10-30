import { describe, it, expect } from "vitest";
import { createRectangularPath } from "../rectangularEdge";

describe("rectangularEdge", () => {
  describe("createRectangularPath", () => {
    it("should create a simple path for widely spaced points", () => {
      const path = createRectangularPath(0, 100, 200, 150);

      expect(path).toContain("M 0 100"); // Start point
      expect(path).toBeTruthy();
      expect(typeof path).toBe("string");
    });

    it("should create a path with default offset", () => {
      const path = createRectangularPath(0, 100, 100, 200);

      expect(path).toMatch(/^M/); // Should start with Move command
      expect(path).toContain("L"); // Should contain Line commands
    });

    it("should create a path with custom offset", () => {
      const path = createRectangularPath(0, 100, 100, 200, { offset: 30 });

      expect(path).toMatch(/^M/);
      expect(path).toBeTruthy();
    });

    it("should handle same Y coordinates (horizontal line)", () => {
      const path = createRectangularPath(0, 100, 200, 100);

      expect(path).toMatch(/^M 0 100/);
      expect(path).toContain("100"); // Should maintain Y coordinate
    });

    it("should handle vertical alignment", () => {
      const path = createRectangularPath(100, 0, 100, 200);

      expect(path).toMatch(/^M 100 0/);
      expect(path).toBeTruthy();
    });

    it("should handle negative coordinates", () => {
      const path = createRectangularPath(-50, -50, 50, 50);

      expect(path).toMatch(/^M -50 -50/);
      expect(path).toBeTruthy();
    });

    it("should handle very close points", () => {
      const path = createRectangularPath(0, 100, 10, 105);

      expect(path).toMatch(/^M 0 100/);
      expect(path).toBeTruthy();
    });

    it("should handle backwards connection (end before start)", () => {
      const path = createRectangularPath(200, 100, 0, 150);

      expect(path).toMatch(/^M 200 100/);
      expect(path).toBeTruthy();
    });

    it("should handle downward direction", () => {
      const path = createRectangularPath(0, 100, 200, 200);

      expect(path).toMatch(/^M 0 100/);
      expect(path).toBeTruthy();
    });

    it("should handle upward direction", () => {
      const path = createRectangularPath(0, 200, 200, 100);

      expect(path).toMatch(/^M 0 200/);
      expect(path).toBeTruthy();
    });

    it("should create valid SVG path syntax", () => {
      const path = createRectangularPath(0, 100, 200, 150);

      // Check for valid SVG path commands
      expect(path).toMatch(/^M/); // Move command
      expect(path).toContain("L"); // Line command
      expect(path).not.toContain("NaN");
      expect(path).not.toContain("undefined");
    });

    it("should handle zero offset", () => {
      const path = createRectangularPath(0, 100, 200, 150, { offset: 0 });

      expect(path).toBeTruthy();
      expect(typeof path).toBe("string");
    });

    it("should handle large offset", () => {
      const path = createRectangularPath(0, 100, 200, 150, { offset: 100 });

      expect(path).toBeTruthy();
      expect(typeof path).toBe("string");
    });
  });
});
