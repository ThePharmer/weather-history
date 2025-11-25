/**
 * Weather Table Component
 * Displays forecast and historical weather data in a table format
 */

import { getWeatherIcon, applyTemperatureColor } from '../utils/style-utils.js';
import { calculateAverage } from '../utils/transform.js';
import { getState } from '../state.js';
import { fahrenheitToCelsius, formatTemperature } from '../utils/units.js';

/**
 * Create and render the weather table
 * @param {HTMLElement} container - Container element
 * @param {Object} data - Merged forecast and history data
 * @returns {HTMLElement} The table element
 */
export function createWeatherTable(container, data) {
    const { forecast, history } = data;
    const { unit } = getState();

    const table = document.createElement('div');
    table.className = 'weather-table';

    // Create header row with dates
    const headerRow = createHeaderRow(forecast);
    table.appendChild(headerRow);

    // Create forecast row
    const forecastRow = createForecastRow(forecast, unit);
    table.appendChild(forecastRow);

    // Create historical rows
    history.forEach((yearData) => {
        const historyRow = createHistoryRow(yearData, forecast, unit);
        table.appendChild(historyRow);
    });

    container.innerHTML = '';
    container.appendChild(table);

    return table;
}

/**
 * Helper to get display temperature based on unit
 */
function getDisplayTemp(tempF, unit) {
    if (unit === 'C') {
        return formatTemperature(fahrenheitToCelsius(tempF), 'C');
    }
    return formatTemperature(tempF, 'F');
}

/**
 * Create header row with dates
 * @param {Array} forecast - Forecast data
 * @returns {HTMLElement} Header row element
 */
function createHeaderRow(forecast) {
    const row = document.createElement('div');
    row.className = 'table-row header-row';

    // Year/Label column
    const labelCell = document.createElement('div');
    labelCell.className = 'table-cell sticky-cell';
    labelCell.textContent = 'Year';
    row.appendChild(labelCell);

    // Date columns
    forecast.forEach((day) => {
        const cell = document.createElement('div');
        cell.className = 'table-cell';
        const date = new Date(day.date);
        cell.innerHTML = `
      <div class="date-label">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    `;
        row.appendChild(cell);
    });

    // Average column
    const avgCell = document.createElement('div');
    avgCell.className = 'table-cell';
    avgCell.textContent = 'Avg';
    row.appendChild(avgCell);

    return row;
}

/**
 * Create forecast row
 * @param {Array} forecast - Forecast data
 * @param {string} unit - Current unit ('F' or 'C')
 * @returns {HTMLElement} Forecast row element
 */
function createForecastRow(forecast, unit) {
    const row = document.createElement('div');
    row.className = 'table-row forecast-row';

    // Label cell
    const labelCell = document.createElement('div');
    labelCell.className = 'table-cell sticky-cell';
    labelCell.textContent = 'Forecast';
    row.appendChild(labelCell);

    // Forecast day cells
    forecast.forEach((day) => {
        const cell = document.createElement('div');
        cell.className = 'table-cell';
        cell.innerHTML = `
      <div class="weather-icon">${getWeatherIcon(day.weatherCode)}</div>
      <div class="temp-high">${getDisplayTemp(day.maxTemp, unit)}</div>
      <div class="temp-low">${getDisplayTemp(day.minTemp, unit)}</div>
    `;
        row.appendChild(cell);
    });

    // Average cell
    const avgMax = calculateAverage(forecast.map((d) => d.maxTemp));
    const avgMin = calculateAverage(forecast.map((d) => d.minTemp));
    const avgCell = document.createElement('div');
    avgCell.className = 'table-cell';
    avgCell.innerHTML = `
    <div class="temp-high">${getDisplayTemp(avgMax, unit)}</div>
    <div class="temp-low">${getDisplayTemp(avgMin, unit)}</div>
  `;
    row.appendChild(avgCell);

    return row;
}

/**
 * Create historical year row
 * @param {Object} yearData - Historical data for one year
 * @param {Array} forecast - Forecast data (for color comparison)
 * @param {string} unit - Current unit ('F' or 'C')
 * @returns {HTMLElement} History row element
 */
function createHistoryRow(yearData, forecast, unit) {
    const row = document.createElement('div');
    row.className = 'table-row history-row';

    // Year label cell
    const labelCell = document.createElement('div');
    labelCell.className = 'table-cell sticky-cell';
    labelCell.textContent = yearData.year;
    row.appendChild(labelCell);

    // Historical day cells
    yearData.days.forEach((day, index) => {
        const cell = document.createElement('div');
        cell.className = 'table-cell';

        // Apply color coding based on forecast comparison
        // Note: Color coding logic should still work with raw F values since it's relative
        if (forecast[index]) {
            applyTemperatureColor(cell, day.maxTemp, forecast[index].maxTemp);
        }

        cell.innerHTML = `
      <div class="temp-high">${getDisplayTemp(day.maxTemp, unit)}</div>
      <div class="temp-low">${getDisplayTemp(day.minTemp, unit)}</div>
    `;
        row.appendChild(cell);
    });

    // Average cell
    const avgCell = document.createElement('div');
    avgCell.className = 'table-cell';
    avgCell.innerHTML = `
    <div class="temp-high">${getDisplayTemp(yearData.avgMax, unit)}</div>
    <div class="temp-low">${getDisplayTemp(yearData.avgMin, unit)}</div>
  `;
    row.appendChild(avgCell);

    return row;
}
