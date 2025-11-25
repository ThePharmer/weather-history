import { parseISO, getYear, getMonth } from 'date-fns';

/**
 * Calculates the warmest 7-day period (highest average max temp)
 * @param {Array} dailyData - Array of DailyWeather objects
 * @returns {Object|null} Record object or null
 */
export function calculateWarmestWeek(dailyData) {
    if (!dailyData || dailyData.length < 7) return null;

    const sorted = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));

    let maxAvg = -Infinity;
    let record = null;

    for (let i = 0; i <= sorted.length - 7; i++) {
        const window = sorted.slice(i, i + 7);
        const sum = window.reduce((acc, day) => acc + day.maxTemp, 0);
        const avg = sum / 7;

        if (avg > maxAvg) {
            maxAvg = avg;
            record = {
                averageTemp: avg,
                startDate: window[0].date,
                endDate: window[6].date,
                year: parseInt(window[0].date.substring(0, 4))
            };
        }
    }

    return record;
}

/**
 * Calculates the coldest 7-day period (lowest average min temp)
 * @param {Array} dailyData - Array of DailyWeather objects
 * @returns {Object|null} Record object or null
 */
export function calculateColdestWeek(dailyData) {
    if (!dailyData || dailyData.length < 7) return null;

    const sorted = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));

    let minAvg = Infinity;
    let record = null;

    for (let i = 0; i <= sorted.length - 7; i++) {
        const window = sorted.slice(i, i + 7);
        const sum = window.reduce((acc, day) => acc + day.minTemp, 0);
        const avg = sum / 7;

        if (avg < minAvg) {
            minAvg = avg;
            record = {
                averageTemp: avg,
                startDate: window[0].date,
                endDate: window[6].date,
                year: parseInt(window[0].date.substring(0, 4))
            };
        }
    }

    return record;
}

/**
 * Calculates snowfall records (Earliest/Latest First/Last Snow)
 * @param {Array} dailyData - Array of DailyWeather objects
 * @returns {Object} Records object
 */
export function calculateSnowfallRecords(dailyData) {
    // Snow codes: 71 (Slight), 73 (Moderate), 75 (Heavy), 77 (Grains), 85 (Slight Showers), 86 (Heavy Showers)
    const snowCodes = [71, 73, 75, 77, 85, 86];

    // Group by season (July 1 to June 30)
    const seasons = {};

    dailyData.forEach(day => {
        if (!snowCodes.includes(day.weatherCode)) return;

        const date = parseISO(day.date);
        const year = getYear(date);
        const month = getMonth(date); // 0-11

        // If month is >= 6 (July), it's the start of season "Year-(Year+1)"
        // If month is < 6 (Jan-June), it's the end of season "(Year-1)-Year"
        let seasonKey;
        if (month >= 6) {
            seasonKey = `${year}-${year + 1}`;
        } else {
            seasonKey = `${year - 1}-${year}`;
        }

        if (!seasons[seasonKey]) {
            seasons[seasonKey] = [];
        }
        seasons[seasonKey].push(day);
    });

    let earliestFirst = null;
    let latestFirst = null;
    let earliestLast = null;
    let latestLast = null;

    Object.values(seasons).forEach(seasonDays => {
        // Sort days in this season
        seasonDays.sort((a, b) => a.date.localeCompare(b.date));

        const firstSnow = seasonDays[0];
        const lastSnow = seasonDays[seasonDays.length - 1];

        if (!earliestFirst || getSeasonOffset(firstSnow.date) < getSeasonOffset(earliestFirst.date)) {
            earliestFirst = firstSnow;
        }
        if (!latestFirst || getSeasonOffset(firstSnow.date) > getSeasonOffset(latestFirst.date)) {
            latestFirst = firstSnow;
        }

        if (!earliestLast || getSeasonOffset(lastSnow.date) < getSeasonOffset(earliestLast.date)) {
            earliestLast = lastSnow;
        }
        if (!latestLast || getSeasonOffset(lastSnow.date) > getSeasonOffset(latestLast.date)) {
            latestLast = lastSnow;
        }
    });

    return {
        earliestFirstSnow: earliestFirst,
        latestFirstSnow: latestFirst,
        earliestLastSnow: earliestLast,
        latestLastSnow: latestLast
    };
}

// Helper to compare dates relative to the start of a snow season (July 1st)
function getSeasonOffset(dateStr) {
    const date = parseISO(dateStr);
    const month = getMonth(date); // 0-11
    const day = date.getDate();

    // July 1st is day 0.
    // July(6) -> 0
    // Aug(7) -> 1
    // ...
    // Dec(11) -> 5
    // Jan(0) -> 6
    // ...
    // June(5) -> 11

    let adjustedMonth = month >= 6 ? month - 6 : month + 6;
    return adjustedMonth * 31 + day;
}
