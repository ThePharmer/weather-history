/**
 * Style utilities for temperature color coding
 */

/**
 * Get temperature color based on comparison with forecast
 * @param {number} historicalTemp - Historical temperature
 * @param {number} forecastTemp - Forecast temperature
 * @param {string} type - 'hot' or 'cold' for warmer/colder
 * @returns {string} CSS color variable name
 */
export function getTemperatureColor(historicalTemp, forecastTemp, type = 'auto') {
    const diff = historicalTemp - forecastTemp;

    if (diff > 0) {
        // Historical is warmer
        if (diff > 10) return 'var(--color-hot-extreme)';
        if (diff > 5) return 'var(--color-hot-high)';
        return 'var(--color-hot-moderate)';
    } else if (diff < 0) {
        // Historical is colder
        const absDiff = Math.abs(diff);
        if (absDiff > 10) return 'var(--color-cold-extreme)';
        if (absDiff > 5) return 'var(--color-cold-high)';
        return 'var(--color-cold-moderate)';
    }

    return 'transparent';
}

/**
 * Apply temperature color to a cell element
 * @param {HTMLElement} element - Cell element
 * @param {number} historicalTemp - Historical temperature
 * @param {number} forecastTemp - Forecast temperature
 */
export function applyTemperatureColor(element, historicalTemp, forecastTemp) {
    const color = getTemperatureColor(historicalTemp, forecastTemp);
    element.style.backgroundColor = color;

    // Add text color for readability
    const diff = Math.abs(historicalTemp - forecastTemp);
    if (diff > 5) {
        element.style.color = 'white';
    }
}

/**
 * Get weather icon for weather code
 * @param {number} code - WMO weather code
 * @returns {string} Weather icon emoji
 */
export function getWeatherIcon(code) {
    // WMO Weather interpretation codes
    if (code === 0) return '☀️'; // Clear sky
    if (code <= 3) return '⛅'; // Partly cloudy
    if (code <= 48) return '🌫️'; // Fog
    if (code <= 67) return '🌧️'; // Rain
    if (code <= 77) return '❄️'; // Snow
    if (code <= 82) return '🌦️'; // Rain showers
    if (code <= 86) return '🌨️'; // Snow showers
    if (code <= 99) return '⛈️'; // Thunderstorm
    return '🌡️'; // Default
}
