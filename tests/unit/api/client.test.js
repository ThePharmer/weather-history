import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from '../../../src/api/client.js';

describe('API Client', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('should make a successful GET request', async () => {
        const mockData = { temperature: 20 };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        const result = await apiClient.get('https://api.example.com/weather');
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/weather', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    });

    it('should handle network errors', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(apiClient.get('https://api.example.com/weather')).rejects.toThrow(
            'Network error'
        );
    });

    it('should handle HTTP errors', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
        });

        await expect(apiClient.get('https://api.example.com/weather')).rejects.toThrow(
            'HTTP error! status: 404'
        );
    });

    it('should handle rate limiting (429)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            statusText: 'Too Many Requests',
        });

        await expect(apiClient.get('https://api.example.com/weather')).rejects.toThrow(
            'HTTP error! status: 429'
        );
    });
});
