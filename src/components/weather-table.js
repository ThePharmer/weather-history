/**
 * Weather Table Component
 * Displays forecast and historical weather data in a table format
 */

import { getWeatherIcon, applyTemperatureColor } from '../utils/style-utils.js';
import { calculateAverage } from '../utils/transform.js';

/**
 * Create and render the weather table
 * @param {HTMLElement} container - Container element
 * @param {Object} data - Merged forecast and history data
 * @returns {HTMLElement} The table element
 */
export function createWeatherTable(container, data) {
    const { forecast, history } = data;

    const table = document.createElement('div');
    table.className = 'weather-table';

    // Create header row with dates
    const headerRow = createHeaderRow(forecast);
    table.appendChild(headerRow);

    // Create forecast row
    const forecastRow = createForecastRow(forecast);
    table.appendChild(forecastRow);

    // Create historical rows
    history.forEach((yearData) => {
        const historyRow = createHistoryRow(yearData, forecast);
        table.appendChild(historyRow);
    });

    container.innerHTML = '';
    container.appendChild(table);

    return table;
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
 * @returns {HTMLElement} Forecast row element
 */
function createForecastRow(forecast) {
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
      <div class="temp-high">${Math.round(day.maxTemp)}°</div>
      <div class="temp-low">${Math.round(day.minTemp)}°</div>
    `;
        row.appendChild(cell);
    });

    // Average cell
    const avgMax = calculateAverage(forecast.map((d) => d.maxTemp));
    const avgMin = calculateAverage(forecast.map((d) => d.minTemp));
    const avgCell = document.createElement('div');
    avgCell.className = 'table-cell';
    avgCell.innerHTML = `
    <div class="temp-high">${Math.round(avgMax)}°</div>
    <div class="temp-low">${Math.round(avgMin)}°</div>
  `;
    row.appendChild(avgCell);

    return row;
}

/**
 * Create historical year row
 * @param {Object} yearData - Historical data for one year
 * @param {Array} forecast - Forecast data (for color comparison)
 * @returns {HTMLElement} History row element
 */
function createHistoryRow(yearData, forecast) {
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
        if (forecast[index]) {
            applyTemperatureColor(cell, day.maxTemp, forecast[index].maxTemp);
        }

        cell.innerHTML = `
      <div class="temp-high">${Math.round(day.maxTemp)}°</div>
      <div class="temp-low">${Math.round(day.minTemp)}°</div>
    `;
        row.appendChild(cell);
    });

    // Average cell
    const avgCell = document.createElement('div');
    avgCell.className = 'table-cell';
    avgCell.innerHTML = `
    <div class="temp-high">${Math.round(yearData.avgMax)}°</div>
    <div class="temp-low">${Math.round(yearData.avgMin)}°</div>
  `;
    row.appendChild(avgCell);

    return row;
}
