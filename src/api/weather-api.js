/**
 * Open-Meteo Weather API wrapper
 * Handles geocoding, forecast, and historical weather data
 */

import { apiClient } from './client.js';

const GEOCODING_API_BASE = '/api/geocoding/v1';
const FORECAST_API_BASE = '/api/forecast/v1';
const ARCHIVE_API_BASE = '/api/archive/v1';

/**
 * Search for a location by name
 * @param {string} query - Location name to search for
 * @returns {Promise<Array>} Array of location results
 */
export async function searchLocation(query) {
    const url = apiClient.buildUrl(`${GEOCODING_API_BASE}/search`, {
        name: query,
        count: 5,
        language: 'en',
        format: 'json',
    });

    const data = await apiClient.get(url);
    return data.results || [];
}

/**
 * Reverse geocode coordinates to get location name
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Location object
 */
export async function reverseGeocode(latitude, longitude) {
    // Open-Meteo doesn't have a dedicated reverse geocoding endpoint
    // We'll search for the nearest location using the coordinates
    const url = apiClient.buildUrl(`${GEOCODING_API_BASE}/search`, {
        name: `${latitude.toFixed(2)},${longitude.toFixed(2)}`,
        count: 1,
        language: 'en',
        format: 'json',
    });

    const data = await apiClient.get(url);
    return data.results?.[0] || null;
}

/**
 * Fetch weather forecast for a location
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {number} days - Number of days to forecast (default: 10)
 * @returns {Promise<Object>} Forecast data
 */
export async function getForecast(latitude, longitude, days = 10) {
    const url = apiClient.buildUrl(`${FORECAST_API_BASE}/forecast`, {
        latitude,
        longitude,
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        timezone: 'auto',
        forecast_days: days,
        temperature_unit: 'fahrenheit',
    });

    return await apiClient.get(url);
}

/**
 * Fetch historical weather data for a location
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Historical weather data
 */
export async function getHistoricalWeather(latitude, longitude, startDate, endDate) {
    const url = apiClient.buildUrl(`${ARCHIVE_API_BASE}/archive`, {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        daily: 'temperature_2m_max,temperature_2m_min,weathercode,snowfall_sum',
        timezone: 'auto',
        temperature_unit: 'fahrenheit',
    });

    console.log('Fetching historical weather URL:', url);
    return await apiClient.get(url);
}

/**
 * Fetch 30 years of historical weather data for records analysis
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object>} Historical weather data
 */
export async function get30YearHistory(latitude, longitude) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1); // Yesterday

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 30);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    return await getHistoricalWeather(
        latitude,
        longitude,
        formatDate(startDate),
        formatDate(endDate)
    );
}
