/**
 * Location Search Component
 * Allows users to search for a location by name
 */

import { searchLocation } from '../api/weather-api.js';
import { setState } from '../state.js';

/**
 * Create and render the location search component
 * @param {HTMLElement} container - Container element to render into
 * @returns {HTMLElement} The search component element
 */
export function createLocationSearch(container) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'location-search';
    searchContainer.innerHTML = `
    <div class="search-wrapper">
      <input 
        type="text" 
        id="location-input" 
        placeholder="Search for a city..." 
        autocomplete="off"
      />
      <button id="search-btn" type="button">Search</button>
      <button id="detect-btn" type="button">📍 Use My Location</button>
    </div>
    <div id="search-results" class="search-results"></div>
  `;

    container.appendChild(searchContainer);

    // Attach event listeners
    const input = searchContainer.querySelector('#location-input');
    const searchBtn = searchContainer.querySelector('#search-btn');
    const detectBtn = searchContainer.querySelector('#detect-btn');
    const resultsContainer = searchContainer.querySelector('#search-results');

    let searchTimeout;

    // Search on input (debounced)
    input.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        searchTimeout = setTimeout(async () => {
            try {
                const results = await searchLocation(query);
                renderSearchResults(results, resultsContainer);
            } catch (error) {
                resultsContainer.innerHTML = `<div class="error">Error searching: ${error.message}</div>`;
            }
        }, 300);
    });

    // Search on button click
    searchBtn.addEventListener('click', async () => {
        const query = input.value.trim();
        if (query.length < 2) return;

        try {
            const results = await searchLocation(query);
            renderSearchResults(results, resultsContainer);
        } catch (error) {
            resultsContainer.innerHTML = `<div class="error">Error searching: ${error.message}</div>`;
        }
    });

    // Detect location button
    detectBtn.addEventListener('click', () => {
        // This will be handled by the main app
        const event = new CustomEvent('detect-location');
        window.dispatchEvent(event);
    });

    return searchContainer;
}

/**
 * Render search results
 * @param {Array} results - Array of location results
 * @param {HTMLElement} container - Container to render results into
 */
function renderSearchResults(results, container) {
    if (!results || results.length === 0) {
        container.innerHTML = '<div class="no-results">No locations found</div>';
        return;
    }

    container.innerHTML = results
        .map(
            (location) => `
      <div class="search-result-item" data-lat="${location.latitude}" data-lon="${location.longitude}">
        <div class="location-name">${location.name}</div>
        <div class="location-details">${location.admin1 || ''} ${location.country || ''}</div>
      </div>
    `
        )
        .join('');

    // Attach click handlers to results
    container.querySelectorAll('.search-result-item').forEach((item) => {
        item.addEventListener('click', () => {
            const lat = parseFloat(item.dataset.lat);
            const lon = parseFloat(item.dataset.lon);
            const name = item.querySelector('.location-name').textContent;

            setState({
                location: { latitude: lat, longitude: lon, name },
            });

            // Clear results
            container.innerHTML = '';

            // Trigger data fetch
            const event = new CustomEvent('location-selected', {
                detail: { latitude: lat, longitude: lon, name },
            });
            window.dispatchEvent(event);
        });
    });
}
