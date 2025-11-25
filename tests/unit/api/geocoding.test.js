import { describe, it, expect, beforeEach, vi } from 'vitest';
import { searchLocation, reverseGeocode } from '../../../src/api/weather-api.js';

describe('Geocoding API', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
        // Mock window.location.origin for buildUrl
        global.window = {
            location: {
                origin: 'http://localhost:3000'
            }
        };
    });

    describe('searchLocation', () => {
        it('should search for a location by name', async () => {
            const mockData = {
                results: [
                    {
                        id: 2643743,
                        name: 'London',
                        latitude: 51.50853,
                        longitude: -0.12574,
                        country: 'United Kingdom',
                        admin1: 'England',
                    },
                ],
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await searchLocation('London');
            expect(result).toEqual(mockData.results);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/geocoding/v1/search'),
                expect.objectContaining({
                    method: 'GET',
                })
            );
        });

        it('should return empty array when no results found', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ results: [] }),
            });

            const result = await searchLocation('NonexistentCity12345');
            expect(result).toEqual([]);
        });
    });

    describe('reverseGeocode', () => {
        it('should get location name from coordinates', async () => {
            const mockData = {
                results: [
                    {
                        id: 2643743,
                        name: 'London',
                        latitude: 51.50853,
                        longitude: -0.12574,
                        country: 'United Kingdom',
                    },
                ],
            };

            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            });

            const result = await reverseGeocode(51.5074, -0.1278);
            expect(result).toEqual(mockData.results[0]);
        });
    });
});
