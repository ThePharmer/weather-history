/**
 * Date utility functions for the Weather History app
 */

/**
 * Format a date as YYYY-MM-DD
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Check if a year is a leap year
 * @param {number} year - The year to check
 * @returns {boolean} True if leap year, false otherwise
 */
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the corresponding date for a historical year, handling leap year edge cases
 * @param {number} currentYear - The current year
 * @param {number} month - The month (1-12)
 * @param {number} day - The day of month
 * @param {number} historicalYear - The historical year to map to
 * @returns {Object} Object with year, month, day
 */
export function getDateForHistoricalYear(currentYear, month, day, historicalYear) {
    // Handle Feb 29 edge case
    if (month === 2 && day === 29) {
        if (!isLeapYear(historicalYear)) {
            // Use March 1 for non-leap years
            return { year: historicalYear, month: 3, day: 1 };
        }
    }
    return { year: historicalYear, month, day };
}

/**
 * Add days to a date
 * @param {Date} date - The starting date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with days added
 */
export function addDays(date, days) {
    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);
    return result;
}

/**
 * Parse a date string in YYYY-MM-DD format
 * @param {string} dateString - Date string to parse
 * @returns {Date} Parsed date
 */
export function parseDate(dateString) {
    return new Date(dateString);
}

/**
 * Get an array of dates for the next N days starting from a given date
 * @param {Date} startDate - The starting date
 * @param {number} count - Number of days
 * @returns {Date[]} Array of dates
 */
export function getDateRange(startDate, count) {
    const dates = [];
    for (let i = 0; i < count; i++) {
        dates.push(addDays(startDate, i));
    }
    return dates;
}
