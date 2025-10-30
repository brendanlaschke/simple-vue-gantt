import { describe, it, expect } from 'vitest';
import { startOfDay, startOfHour, startOfWeek, startOfMonth, startOfYear } from '../dateNormalization';

describe('dateNormalization', () => {
  describe('startOfDay', () => {
    it('should return start of day (00:00:00)', () => {
      const date = new Date('2024-10-15T14:30:45.123');
      const result = startOfDay(date);
      
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(9); // October is month 9
      expect(result.getFullYear()).toBe(2024);
    });

    it('should not modify already normalized date', () => {
      const date = new Date('2024-10-15T00:00:00.000');
      const result = startOfDay(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('startOfHour', () => {
    it('should return start of hour (XX:00:00)', () => {
      const date = new Date('2024-10-15T14:30:45.123');
      const result = startOfHour(date);
      
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should not modify already normalized date', () => {
      const date = new Date('2024-10-15T14:00:00.000');
      const result = startOfHour(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });
  });

  describe('startOfWeek', () => {
    it('should return start of week (Monday)', () => {
      // Wednesday, October 16, 2024
      const date = new Date('2024-10-16T14:30:45.123');
      const result = startOfWeek(date);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(14); // October 14 is the Monday
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should return same date if already Monday', () => {
      const date = new Date('2024-10-14T14:30:45.123'); // Monday
      const result = startOfWeek(date);
      
      expect(result.getDay()).toBe(1);
      expect(result.getDate()).toBe(14);
      expect(result.getHours()).toBe(0);
    });

    it('should handle week crossing month boundary', () => {
      // Saturday, November 2, 2024
      const date = new Date('2024-11-02');
      const result = startOfWeek(date);
      
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getMonth()).toBe(9); // October (previous month)
      expect(result.getDate()).toBe(28);
    });
  });

  describe('startOfMonth', () => {
    it('should return start of month (1st day)', () => {
      const date = new Date('2024-10-15T14:30:45.123');
      const result = startOfMonth(date);
      
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(9); // October
      expect(result.getFullYear()).toBe(2024);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should not modify if already 1st of month', () => {
      const date = new Date('2024-10-01T00:00:00.000');
      const result = startOfMonth(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle last day of month', () => {
      const date = new Date('2024-02-29T23:59:59'); // Leap year
      const result = startOfMonth(date);
      
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(1); // February
    });
  });

  describe('startOfYear', () => {
    it('should return start of year (January 1st)', () => {
      const date = new Date('2024-10-15T14:30:45.123');
      const result = startOfYear(date);
      
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it('should not modify if already January 1st', () => {
      const date = new Date('2024-01-01T00:00:00.000');
      const result = startOfYear(date);
      
      expect(result.getTime()).toBe(date.getTime());
    });

    it('should handle last day of year', () => {
      const date = new Date('2024-12-31T23:59:59');
      const result = startOfYear(date);
      
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });
  });
});
