import { describe, it, expect } from 'vitest';
import { mergeForecastsWithHistory, calculateAverage } from '../../../src/utils/transform.js';

describe('Data Transformation', () => {
    describe('mergeForecastsWithHistory', () => {
        it('should merge forecast with 5 years of historical data', () => {
            const forecast = {
                daily: {
                    time: ['2024-11-24', '2024-11-25'],
                    temperature_2m_max: [15.2, 16.1],
                    temperature_2m_min: [8.3, 9.1],
                    weathercode: [1, 2],
                },
            };

            const historicalData = [
                {
                    year: 2023,
                    daily: {
                        time: ['2023-11-24', '2023-11-25'],
                        temperature_2m_max: [14.5, 15.8],
                        temperature_2m_min: [7.9, 8.5],
                    },
                },
                {
                    year: 2022,
                    daily: {
                        time: ['2022-11-24', '2022-11-25'],
                        temperature_2m_max: [13.1, 14.2],
                        temperature_2m_min: [6.5, 7.2],
                    },
                },
            ];

            const result = mergeForecastsWithHistory(forecast, historicalData);

            expect(result).toHaveProperty('forecast');
            expect(result).toHaveProperty('history');
            expect(result.forecast).toHaveLength(2);
            expect(result.history).toHaveLength(2);
            expect(result.history[0].year).toBe(2023);
        });
    });

    describe('calculateAverage', () => {
        it('should calculate average of an array of numbers', () => {
            expect(calculateAverage([10, 20, 30])).toBe(20);
            expect(calculateAverage([5, 15])).toBe(10);
        });

        it('should handle empty arrays', () => {
            expect(calculateAverage([])).toBe(0);
        });

        it('should exclude null and undefined values', () => {
            expect(calculateAverage([10, null, 20, undefined, 30])).toBe(20);
        });
    });
});
