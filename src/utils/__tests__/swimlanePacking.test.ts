import { describe, it, expect } from 'vitest';
import { packTasksIntoRows, tasksOverlap } from '../swimlanePacking';

describe('swimlanePacking', () => {
  describe('tasksOverlap', () => {
    it('should return true when tasks overlap', () => {
      const task1 = { x: 0, width: 100 };
      const task2 = { x: 50, width: 100 };
      expect(tasksOverlap(task1, task2)).toBe(true);
    });

    it('should return false when tasks do not overlap', () => {
      const task1 = { x: 0, width: 100 };
      const task2 = { x: 100, width: 100 };
      expect(tasksOverlap(task1, task2)).toBe(false);
    });

    it('should return false when tasks are adjacent', () => {
      const task1 = { x: 0, width: 50 };
      const task2 = { x: 50, width: 50 };
      expect(tasksOverlap(task1, task2)).toBe(false);
    });

    it('should return true when one task contains another', () => {
      const task1 = { x: 0, width: 200 };
      const task2 = { x: 50, width: 50 };
      expect(tasksOverlap(task1, task2)).toBe(true);
    });

    it('should return true when tasks start at same position', () => {
      const task1 = { x: 100, width: 50 };
      const task2 = { x: 100, width: 100 };
      expect(tasksOverlap(task1, task2)).toBe(true);
    });
  });

  describe('packTasksIntoRows', () => {
    it('should pack non-overlapping tasks into one row', () => {
      const tasks = [
        { id: '1', x: 0, width: 50 },
        { id: '2', x: 60, width: 50 },
        { id: '3', x: 120, width: 50 },
      ];
      const result = packTasksIntoRows(tasks, 5);
      
      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(0);
      expect(result.get('3')).toBe(0);
    });

    it('should pack overlapping tasks into multiple rows', () => {
      const tasks = [
        { id: '1', x: 0, width: 100 },
        { id: '2', x: 50, width: 100 },
        { id: '3', x: 100, width: 100 },
      ];
      const result = packTasksIntoRows(tasks, 5);
      
      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(1); // Overlaps with task 1
      expect(result.get('3')).toBe(2); // Cannot fit in row 0 due to padding (105 > 100)
    });

    it('should respect padding when packing tasks', () => {
      const tasks = [
        { id: '1', x: 0, width: 50 },
        { id: '2', x: 50, width: 50 }, // Exactly at the end of task 1
      ];
      const result = packTasksIntoRows(tasks, 10);
      
      // With 10px padding, task 2 should go to a new row
      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(1);
    });

    it('should handle empty task array', () => {
      const tasks: Array<{ id: string; x: number; width: number }> = [];
      const result = packTasksIntoRows(tasks, 5);
      
      expect(result.size).toBe(0);
    });

    it('should handle single task', () => {
      const tasks = [{ id: '1', x: 100, width: 200 }];
      const result = packTasksIntoRows(tasks, 5);
      
      expect(result.get('1')).toBe(0);
    });

    it('should pack complex overlapping scenario', () => {
      const tasks = [
        { id: '1', x: 0, width: 100 },
        { id: '2', x: 50, width: 80 },
        { id: '3', x: 80, width: 60 },
        { id: '4', x: 110, width: 50 },
        { id: '5', x: 140, width: 40 },
      ];
      const result = packTasksIntoRows(tasks, 5);
      
      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(1); // Overlaps with 1
      expect(result.get('3')).toBe(2); // Overlaps with 1 and 2
      expect(result.get('4')).toBe(0); // Can fit after 1 ends
      expect(result.get('5')).toBe(1); // Can fit after 2 ends
    });

    it('should handle tasks in random order by sorting them', () => {
      const tasks = [
        { id: '3', x: 200, width: 50 },
        { id: '1', x: 0, width: 50 },
        { id: '2', x: 100, width: 50 },
      ];
      const result = packTasksIntoRows(tasks, 5);
      
      // All should be in row 0 since they don't overlap
      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(0);
      expect(result.get('3')).toBe(0);
    });
  });
});
