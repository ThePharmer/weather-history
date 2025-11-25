import { describe, it, expect } from 'vitest';
import { formatDate, isLeapYear, getDateForHistoricalYear, addDays } from '../../../src/utils/date-utils.js';

describe('Date Utilities', () => {
    describe('formatDate', () => {
        it('should format date as YYYY-MM-DD', () => {
            const date = new Date('2024-11-24');
            expect(formatDate(date)).toBe('2024-11-24');
        });

        it('should handle single-digit months and days', () => {
            const date = new Date('2024-01-05');
            expect(formatDate(date)).toBe('2024-01-05');
        });
    });

    describe('isLeapYear', () => {
        it('should identify leap years correctly', () => {
            expect(isLeapYear(2024)).toBe(true);
            expect(isLeapYear(2020)).toBe(true);
            expect(isLeapYear(2000)).toBe(true);
        });

        it('should identify non-leap years correctly', () => {
            expect(isLeapYear(2023)).toBe(false);
            expect(isLeapYear(2021)).toBe(false);
            expect(isLeapYear(1900)).toBe(false);
        });
    });

    describe('getDateForHistoricalYear', () => {
        it('should return same date for non-leap-year dates', () => {
            const result = getDateForHistoricalYear(2024, 11, 24, 2023);
            expect(result).toEqual({ year: 2023, month: 11, day: 24 });
        });

        it('should handle Feb 29 in leap year to leap year', () => {
            const result = getDateForHistoricalYear(2024, 2, 29, 2020);
            expect(result).toEqual({ year: 2020, month: 2, day: 29 });
        });

        it('should handle Feb 29 in leap year to non-leap year (use March 1)', () => {
            const result = getDateForHistoricalYear(2024, 2, 29, 2023);
            expect(result).toEqual({ year: 2023, month: 3, day: 1 });
        });
    });

    describe('addDays', () => {
        it('should add days correctly', () => {
            const date = new Date('2024-11-24');
            const result = addDays(date, 5);
            expect(formatDate(result)).toBe('2024-11-29');
        });

        it('should handle month boundaries', () => {
            const date = new Date('2024-11-28');
            const result = addDays(date, 5);
            expect(formatDate(result)).toBe('2024-12-03');
        });
    });
});
