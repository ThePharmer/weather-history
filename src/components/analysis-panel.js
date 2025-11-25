import { formatDate } from '../utils/date-utils.js';
import { getState } from '../state.js';
import { fahrenheitToCelsius, formatTemperature } from '../utils/units.js';

export function createAnalysisPanel(records) {
    const container = document.createElement('div');
    container.className = 'analysis-panel';

    if (!records) {
        container.innerHTML = '<p>Loading analysis...</p>';
        return container;
    }

    const { warmestWeek, coldestWeek, snowfall } = records;
    const { unit } = getState();

    const html = `
    <h2>30-Year Extreme Weather Records</h2>
    <div class="records-grid">
      <div class="record-card warm">
        <h3>Warmest Week</h3>
        <div class="record-value">${warmestWeek ? getDisplayTemp(warmestWeek.averageTemp, unit) : 'N/A'}</div>
        <div class="record-date">${warmestWeek ? formatDateRange(warmestWeek.startDate, warmestWeek.endDate) : '-'}</div>
        <div class="record-year">${warmestWeek ? warmestWeek.year : ''}</div>
      </div>
      
      <div class="record-card cold">
        <h3>Coldest Week</h3>
        <div class="record-value">${coldestWeek ? getDisplayTemp(coldestWeek.averageTemp, unit) : 'N/A'}</div>
        <div class="record-date">${coldestWeek ? formatDateRange(coldestWeek.startDate, coldestWeek.endDate) : '-'}</div>
        <div class="record-year">${coldestWeek ? coldestWeek.year : ''}</div>
      </div>
      
      <div class="record-card snow">
        <h3>Snowfall Records</h3>
        <div class="snow-stats">
          <div class="snow-stat">
            <span class="label">Earliest First Snow:</span>
            <span class="value">${snowfall.earliestFirstSnow ? formatDate(snowfall.earliestFirstSnow.date) : 'N/A'}</span>
          </div>
          <div class="snow-stat">
            <span class="label">Latest First Snow:</span>
            <span class="value">${snowfall.latestFirstSnow ? formatDate(snowfall.latestFirstSnow.date) : 'N/A'}</span>
          </div>
          <div class="snow-stat">
            <span class="label">Earliest Last Snow:</span>
            <span class="value">${snowfall.earliestLastSnow ? formatDate(snowfall.earliestLastSnow.date) : 'N/A'}</span>
          </div>
          <div class="snow-stat">
            <span class="label">Latest Last Snow:</span>
            <span class="value">${snowfall.latestLastSnow ? formatDate(snowfall.latestLastSnow.date) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  `;

    container.innerHTML = html;
    return container;
}

function getDisplayTemp(tempF, unit) {
    if (unit === 'C') {
        return formatTemperature(fahrenheitToCelsius(tempF), 'C');
    }
    return formatTemperature(tempF, 'F');
}

function formatDateRange(start, end) {
    return `${formatDate(start)} - ${formatDate(end)}`;
}
