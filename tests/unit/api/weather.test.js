import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getForecast, getHistoricalWeather } from '../../../src/api/weather-api.js';

describe('Weather API', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
        // Mock window.location.origin for buildUrl
        global.window = {
            location: {
                origin: 'http://localhost:3000'
            }
        };
    });

    describe('getForecast', () => {
        it('should fetch 10-day forecast', async () => {
            const mockData = {
                daily: {
                    time: ['2024-11-24', '2024-11-25'],
                    temperature_2m_max: [15.2, 16.1],
                    temperature_2m_min: [8.3, 9.1],
                    weathercode: [1, 2],
                },
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await getForecast(51.5074, -0.1278, 10);
            expect(result).toEqual(mockData);

            // Check for the proxy path, not the upstream URL
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/forecast/v1/forecast'),
                expect.any(Object)
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('temperature_unit=fahrenheit'),
                expect.any(Object)
            );
        });
    });

    describe('getHistoricalWeather', () => {
        it('should fetch historical weather data', async () => {
            const mockData = {
                daily: {
                    time: ['2023-11-24', '2023-11-25'],
                    temperature_2m_max: [14.5, 15.8],
                    temperature_2m_min: [7.9, 8.5],
                    weathercode: [0, 1],
                },
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await getHistoricalWeather(51.5074, -0.1278, '2023-11-24', '2023-11-25');
            expect(result).toEqual(mockData);

            // Check for the proxy path
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/archive/v1/archive'),
                expect.any(Object)
            );
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('temperature_unit=fahrenheit'),
                expect.any(Object)
            );
        });
    });
});
