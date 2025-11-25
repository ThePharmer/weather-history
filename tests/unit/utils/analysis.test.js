import { describe, it, expect } from 'vitest';
import { calculateWarmestWeek, calculateColdestWeek, calculateSnowfallRecords } from '../../../src/utils/analysis.js';

describe('Analysis Utils', () => {
    // Mock data helper
    const createDailyData = (date, maxTemp, minTemp, weatherCode = 0) => ({
        date,
        maxTemp,
        minTemp,
        weatherCode
    });

    describe('calculateWarmestWeek', () => {
        it('should identify the warmest 7-day period based on max temps', () => {
            // Create 10 days of data
            const data = [
                createDailyData('2020-07-01', 20, 10),
                createDailyData('2020-07-02', 25, 15),
                createDailyData('2020-07-03', 30, 20), // Start of warm week
                createDailyData('2020-07-04', 32, 22),
                createDailyData('2020-07-05', 35, 25),
                createDailyData('2020-07-06', 33, 23),
                createDailyData('2020-07-07', 31, 21),
                createDailyData('2020-07-08', 30, 20),
                createDailyData('2020-07-09', 29, 19), // End of warm week (avg high)
                createDailyData('2020-07-10', 20, 10),
            ];

            // Note: In a real 30-year dataset, we'd have thousands of points.
            // This test checks the rolling window logic.

            const result = calculateWarmestWeek(data);

            expect(result).toBeDefined();
            expect(result.averageTemp).toBeCloseTo(31.43, 2); // (30+32+35+33+31+30+29)/7
            expect(result.startDate).toBe('2020-07-03');
            expect(result.endDate).toBe('2020-07-09');
            expect(result.year).toBe(2020);
        });

        it('should return null for insufficient data', () => {
            const data = [createDailyData('2020-01-01', 10, 0)];
            expect(calculateWarmestWeek(data)).toBeNull();
        });
    });

    describe('calculateColdestWeek', () => {
        it('should identify the coldest 7-day period based on min temps', () => {
            const data = [
                createDailyData('2020-01-01', 0, -5),
                createDailyData('2020-01-02', 0, -10), // Start of cold week
                createDailyData('2020-01-03', 0, -12),
                createDailyData('2020-01-04', 0, -15),
                createDailyData('2020-01-05', 0, -14),
                createDailyData('2020-01-06', 0, -13),
                createDailyData('2020-01-07', 0, -11),
                createDailyData('2020-01-08', 0, -10), // End of cold week
                createDailyData('2020-01-09', 0, -5),
                createDailyData('2020-01-10', 0, -2),
            ];

            const result = calculateColdestWeek(data);

            expect(result).toBeDefined();
            expect(result.averageTemp).toBeCloseTo(-12.14, 2); // (-10-12-15-14-13-11-10)/7
            expect(result.startDate).toBe('2020-01-02');
            expect(result.endDate).toBe('2020-01-08');
        });
    });

    describe('calculateSnowfallRecords', () => {
        // Weather code 71, 73, 75, 77, 85, 86 indicate snow in Open-Meteo
        // Let's assume we pass in a list of all days

        it('should identify earliest and latest first/last snowfall', () => {
            const data = [
                // Season 1 (2020-2021)
                createDailyData('2020-11-15', 5, 0, 71), // First snow 2020
                createDailyData('2020-12-01', 2, -2, 73),
                createDailyData('2021-03-10', 5, 0, 71), // Last snow 2020 season

                // Season 2 (2021-2022)
                createDailyData('2021-10-20', 5, 0, 71), // First snow 2021 (Earliest First)
                createDailyData('2022-04-01', 5, 0, 71), // Last snow 2021 season (Latest Last)

                // Season 3 (2022-2023)
                createDailyData('2022-12-01', 5, 0, 71), // First snow 2022 (Latest First)
                createDailyData('2023-02-15', 5, 0, 71), // Last snow 2022 season (Earliest Last)
            ];

            const result = calculateSnowfallRecords(data);

            expect(result.earliestFirstSnow.date).toBe('2021-10-20'); // Oct 20
            expect(result.latestFirstSnow.date).toBe('2022-12-01');   // Dec 01

            expect(result.earliestLastSnow.date).toBe('2023-02-15');  // Feb 15
            expect(result.latestLastSnow.date).toBe('2022-04-01');    // Apr 01
        });

        it('should handle years with no snow gracefully', () => {
            const data = [createDailyData('2020-07-01', 30, 20, 0)];
            const result = calculateSnowfallRecords(data);
            expect(result.earliestFirstSnow).toBeNull();
        });
    });
});
