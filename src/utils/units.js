/**
 * Convert Celsius to Fahrenheit
 * @param {number} celsius 
 * @returns {number}
 */
export function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

/**
 * Convert Fahrenheit to Celsius
 * @param {number} fahrenheit 
 * @returns {number}
 */
export function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

/**
 * Format temperature with unit
 * @param {number} temp 
 * @param {string} unit 'C' or 'F'
 * @returns {string}
 */
export function formatTemperature(temp, unit) {
    return `${Math.round(temp)}°${unit}`;
}
