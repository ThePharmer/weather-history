/**
 * UI Status Component
 * Loading states and error messages
 */

/**
 * Show loading spinner
 * @param {HTMLElement} container - Container element
 * @param {string} message - Loading message
 */
export function showLoading(container, message = 'Loading...') {
    container.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Show error message
 * @param {HTMLElement} container - Container element
 * @param {string} message - Error message
 * @param {Function} onRetry - Optional retry callback
 */
export function showError(container, message, onRetry = null) {
    const retryButton = onRetry
        ? `<button class="retry-btn" onclick="this.dispatchEvent(new CustomEvent('retry', { bubbles: true }))">Retry</button>`
        : '';

    container.innerHTML = `
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">${message}</p>
      ${retryButton}
    </div>
  `;

    if (onRetry) {
        container.addEventListener('retry', onRetry, { once: true });
    }
}

/**
 * Clear status messages
 * @param {HTMLElement} container - Container element
 */
export function clearStatus(container) {
    container.innerHTML = '';
}
