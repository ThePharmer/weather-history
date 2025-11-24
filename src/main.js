/**
 * Weather History App - Main Entry Point
 */

import './styles/variables.css';
import './styles/table.css';
import './styles/responsive.css';
import './style.css';

import { createLocationSearch } from './components/location-search.js';
import { createWeatherTable } from './components/weather-table.js';
import { showLoading, showError } from './components/ui-status.js';
import { getCurrentPosition } from './utils/geo.js';
import { getForecast, getHistoricalWeather, reverseGeocode } from './api/weather-api.js';
import { mergeForecastsWithHistory, fetchMultiYearHistory } from './utils/transform.js';
import { formatDate, getDateRange } from './utils/date-utils.js';
import { setState, getState, subscribe } from './state.js';

// Initialize app
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <header class="app-header">
      <h1>🌤️ Weather History & Analysis</h1>
      <p class="subtitle">Compare 10-day forecasts with 5 years of historical data</p>
    </header>
    
    <div id="location-container"></div>
    <div id="status-container"></div>
    <div id="table-container"></div>
  </div>
`;

const locationContainer = document.querySelector('#location-container');
const statusContainer = document.querySelector('#status-container');
const tableContainer = document.querySelector('#table-container');

// Create location search component
createLocationSearch(locationContainer);

// Listen for location detection
window.addEventListener('detect-location', async () => {
  try {
    showLoading(statusContainer, 'Detecting your location...');
    const coords = await getCurrentPosition();

    // Reverse geocode to get location name
    const location = await reverseGeocode(coords.latitude, coords.longitude);

    setState({
      location: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        name: location?.name || 'Your Location',
      },
    });

    // Trigger data fetch
    await fetchWeatherData(coords.latitude, coords.longitude);
  } catch (error) {
    showError(
      statusContainer,
      error.message || 'Failed to detect location. Please search for a city instead.',
      () => window.dispatchEvent(new CustomEvent('detect-location'))
    );
  }
});

// Listen for location selection
window.addEventListener('location-selected', async (event) => {
  const { latitude, longitude } = event.detail;
  await fetchWeatherData(latitude, longitude);
});

/**
 * Fetch and display weather data for a location
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 */
async function fetchWeatherData(latitude, longitude) {
  try {
    showLoading(statusContainer, 'Loading weather data...');

    // Get forecast
    const forecast = await getForecast(latitude, longitude, 10);

    // Get date range for historical data
    const today = new Date();
    const dates = getDateRange(today, 10).map(formatDate);

    // Fetch 5 years of historical data in parallel
    const historicalData = await fetchMultiYearHistory(
      getHistoricalWeather,
      latitude,
      longitude,
      dates,
      5
    );

    // Merge data
    const mergedData = mergeForecastsWithHistory(forecast, historicalData);

    // Render table
    statusContainer.innerHTML = '';
    createWeatherTable(tableContainer, mergedData);

    setState({
      forecastData: forecast,
      historicalData,
      loading: false,
      error: null,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    showError(
      statusContainer,
      'Failed to load weather data. Please try again.',
      () => {
        const state = getState();
        if (state.location) {
          fetchWeatherData(state.location.latitude, state.location.longitude);
        }
      }
    );
  }
}

// Auto-detect location on load (optional - can be disabled)
// Uncomment the following line to enable auto-detection on load:
// window.dispatchEvent(new CustomEvent('detect-location'));
