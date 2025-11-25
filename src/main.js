/**
 * Weather History App - Main Entry Point
 */

import './styles/variables.css';
import './styles/table.css';
import './styles/responsive.css';
import './styles/analysis.css';
import './styles/header.css';
import './style.css';

import { createLocationSearch } from './components/location-search.js';
import { createWeatherTable } from './components/weather-table.js';
import { createAnalysisPanel } from './components/analysis-panel.js';
import { showLoading, showError } from './components/ui-status.js';
import { getCurrentPosition } from './utils/geo.js';
import { getForecast, getHistoricalWeather, reverseGeocode, get30YearHistory } from './api/weather-api.js';
import { mergeForecastsWithHistory, fetchMultiYearHistory } from './utils/transform.js';
import { calculateWarmestWeek, calculateColdestWeek, calculateSnowfallRecords } from './utils/analysis.js';
import { formatDate, getDateRange } from './utils/date-utils.js';
import { setState, getState, subscribe } from './state.js';

// Initialize app
document.querySelector('#app').innerHTML = `
  <div class="app-container">
    <header class="app-header">
      <div class="header-content">
        <div>
          <h1>🌤️ Weather History & Analysis</h1>
          <p class="subtitle">Compare 10-day forecasts with 5 years of historical data</p>
        </div>
        <button id="unit-toggle" class="unit-toggle" aria-label="Toggle Unit">
          Switch to °C
        </button>
      </div>
    </header>
    
    <div id="location-container"></div>
    <div id="status-container"></div>
    <div id="table-container"></div>
    <div id="analysis-container"></div>
  </div>
`;

const locationContainer = document.querySelector('#location-container');
const statusContainer = document.querySelector('#status-container');
const tableContainer = document.querySelector('#table-container');
const analysisContainer = document.querySelector('#analysis-container');
const unitToggle = document.querySelector('#unit-toggle');

// Handle unit toggle
unitToggle.addEventListener('click', () => {
  const { unit } = getState();
  const newUnit = unit === 'F' ? 'C' : 'F';
  setState({ unit: newUnit });
});

// Subscribe to state changes to update UI
subscribe((state) => {
  // Update toggle button text
  unitToggle.textContent = state.unit === 'F' ? 'Switch to °C' : 'Switch to °F';

  // Re-render table if data exists
  if (state.forecastData && state.historicalData) {
    const mergedData = mergeForecastsWithHistory(state.forecastData, state.historicalData);
    createWeatherTable(tableContainer, mergedData);
  }

  // Re-render analysis if data exists
  if (state.records) {
    analysisContainer.innerHTML = '';
    analysisContainer.appendChild(createAnalysisPanel(state.records));
  }
});

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

    // Fetch and render analysis (non-blocking for table)
    analysisContainer.innerHTML = '<p class="loading-text">Loading 30-year analysis...</p>';

    try {
      const history30Year = await get30YearHistory(latitude, longitude);
      const dailyData = history30Year.daily ? history30Year.daily.time.map((t, i) => ({
        date: t,
        maxTemp: history30Year.daily.temperature_2m_max[i],
        minTemp: history30Year.daily.temperature_2m_min[i],
        weatherCode: history30Year.daily.weathercode[i]
      })) : [];

      const records = {
        warmestWeek: calculateWarmestWeek(dailyData),
        coldestWeek: calculateColdestWeek(dailyData),
        snowfall: calculateSnowfallRecords(dailyData)
      };

      analysisContainer.innerHTML = '';
      analysisContainer.appendChild(createAnalysisPanel(records));

      setState({
        forecastData: forecast,
        historicalData,
        records,
        loading: false,
        error: null,
      });
    } catch (analysisError) {
      console.error('Analysis fetch failed:', analysisError);
      console.error('Analysis error details:', analysisError.message, analysisError.stack);
      analysisContainer.innerHTML = `<p class="error-text">Failed to load analysis data: ${analysisError.message}</p>`;
      // Still update state with main data
      setState({
        forecastData: forecast,
        historicalData,
        loading: false,
        error: null,
      });
    }
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
