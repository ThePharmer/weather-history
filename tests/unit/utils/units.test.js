import { describe, it, expect } from 'vitest';
import { celsiusToFahrenheit, fahrenheitToCelsius, formatTemperature } from '../../../src/utils/units.js';

describe('Unit Utils', () => {
    describe('celsiusToFahrenheit', () => {
        it('should convert 0°C to 32°F', () => {
            expect(celsiusToFahrenheit(0)).toBe(32);
        });

        it('should convert 100°C to 212°F', () => {
            expect(celsiusToFahrenheit(100)).toBe(212);
        });

        it('should convert -40°C to -40°F', () => {
            expect(celsiusToFahrenheit(-40)).toBe(-40);
        });
    });

    describe('fahrenheitToCelsius', () => {
        it('should convert 32°F to 0°C', () => {
            expect(fahrenheitToCelsius(32)).toBe(0);
        });

        it('should convert 212°F to 100°C', () => {
            expect(fahrenheitToCelsius(212)).toBe(100);
        });

        it('should handle decimals correctly', () => {
            // 50°F is 10°C
            expect(fahrenheitToCelsius(50)).toBe(10);
            // 70°F is ~21.11°C
            expect(fahrenheitToCelsius(70)).toBeCloseTo(21.11, 2);
        });
    });

    describe('formatTemperature', () => {
        it('should format with unit symbol', () => {
            expect(formatTemperature(25, 'C')).toBe('25°C');
            expect(formatTemperature(77, 'F')).toBe('77°F');
        });

        it('should round to nearest integer by default', () => {
            expect(formatTemperature(25.6, 'C')).toBe('26°C');
        });
    });
});
