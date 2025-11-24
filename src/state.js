/**
 * Simple global state management for the Weather History app
 */

const state = {
    location: null,
    forecastData: null,
    historicalData: null,
    extremeWeatherData: null,
    loading: false,
    error: null,
};

const listeners = new Set();

/**
 * Get the current state
 * @returns {Object} Current application state
 */
export function getState() {
    return { ...state };
}

/**
 * Update the state and notify listeners
 * @param {Object} updates - Partial state updates
 */
export function setState(updates) {
    Object.assign(state, updates);
    notifyListeners();
}

/**
 * Subscribe to state changes
 * @param {Function} listener - Callback function to be called on state changes
 * @returns {Function} Unsubscribe function
 */
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Notify all listeners of state changes
 */
function notifyListeners() {
    listeners.forEach(listener => listener(getState()));
}

/**
 * Reset state to initial values
 */
export function resetState() {
    state.location = null;
    state.forecastData = null;
    state.historicalData = null;
    state.extremeWeatherData = null;
    state.loading = false;
    state.error = null;
    notifyListeners();
}
