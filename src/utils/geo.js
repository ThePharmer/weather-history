/**
 * Browser Geolocation utility
 */

/**
 * Get the user's current position using the browser's Geolocation API
 * @returns {Promise<{latitude: number, longitude: number}>} User's coordinates
 * @throws {Error} If geolocation is not supported or permission is denied
 */
export async function getCurrentPosition() {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve location';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
            }
        );
    });
}

/**
 * Check if geolocation is available
 * @returns {boolean} True if geolocation is supported
 */
export function isGeolocationAvailable() {
    return 'geolocation' in navigator;
}
