/**
 * Base API client with error handling
 */

/**
 * Make a GET request to the specified URL
 * @param {string} url - The URL to fetch
 * @param {Object} options - Additional fetch options
 * @returns {Promise<Object>} The JSON response
 * @throws {Error} If the request fails
 */
async function get(url, options = {}) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // Re-throw with more context if needed
        if (error.message.includes('HTTP error')) {
            throw error;
        }
        throw new Error(`Network error: ${error.message}`);
    }
}

/**
 * Build a URL with query parameters
 * @param {string} baseUrl - The base URL (can be absolute or relative)
 * @param {Object} params - Query parameters as key-value pairs
 * @returns {string} The complete URL with query string
 */
function buildUrl(baseUrl, params = {}) {
    // Handle relative URLs by using window.location.origin
    const url = baseUrl.startsWith('http')
        ? new URL(baseUrl)
        : new URL(baseUrl, window.location.origin);

    Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
}

export const apiClient = {
    get,
    buildUrl,
};
