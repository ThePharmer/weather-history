/**
 * Data transformation utilities
 * Merge forecast and historical data for display
 */

/**
 * Calculate average of an array of numbers
 * @param {Array<number>} values - Array of numbers
 * @returns {number} Average value
 */
export function calculateAverage(values) {
    const validValues = values.filter((v) => v !== null && v !== undefined && !isNaN(v));
    if (validValues.length === 0) return 0;
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return sum / validValues.length;
}

/**
 * Merge forecast data with historical data for the same dates
 * @param {Object} forecast - Forecast data from API
 * @param {Array<Object>} historicalData - Array of historical data objects (one per year)
 * @returns {Object} Merged data structure for rendering
 */
export function mergeForecastsWithHistory(forecast, historicalData) {
    const forecastDays = forecast.daily.time.map((date, index) => ({
        date,
        maxTemp: forecast.daily.temperature_2m_max[index],
        minTemp: forecast.daily.temperature_2m_min[index],
        weatherCode: forecast.daily.weathercode[index],
    }));

    const historyRows = historicalData.map((yearData) => {
        const days = yearData.daily.time.map((date, index) => ({
            date,
            maxTemp: yearData.daily.temperature_2m_max[index],
            minTemp: yearData.daily.temperature_2m_min[index],
        }));

        // Calculate average for this year
        const avgMax = calculateAverage(days.map((d) => d.maxTemp));
        const avgMin = calculateAverage(days.map((d) => d.minTemp));

        return {
            year: yearData.year,
            days,
            avgMax,
            avgMin,
        };
    });

    return {
        forecast: forecastDays,
        history: historyRows,
    };
}

/**
 * Fetch historical data for multiple years in parallel
 * @param {Function} fetchFn - Function to fetch historical data for a single year
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @param {Array<string>} dates - Array of dates to fetch (YYYY-MM-DD)
 * @param {number} yearsBack - Number of years to go back (default: 5)
 * @returns {Promise<Array>} Array of historical data objects
 */
export async function fetchMultiYearHistory(fetchFn, latitude, longitude, dates, yearsBack = 5) {
    const currentYear = new Date().getFullYear();
    const promises = [];

    for (let i = 1; i <= yearsBack; i++) {
        const year = currentYear - i;
        const startDate = dates[0].replace(/^\d{4}/, year);
        const endDate = dates[dates.length - 1].replace(/^\d{4}/, year);

        promises.push(
            fetchFn(latitude, longitude, startDate, endDate).then((data) => ({
                year,
                daily: data.daily,
            }))
        );
    }

    return await Promise.all(promises);
}
