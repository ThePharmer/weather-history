# Research: Weather History & Analysis

**Feature**: Weather History App
**Date**: 2025-11-24

## 1. Data Source: Open-Meteo API

**Decision**: Use Open-Meteo Free Tier.
**Rationale**: Requested by user. No API key required. Supports both Forecast and Historical data.

### Endpoints Required
1.  **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=10&language=en&format=json`
2.  **Forecast**: `https://api.open-meteo.com/v1/forecast`
    *   Params: `latitude`, `longitude`, `daily=weather_code,temperature_2m_max,temperature_2m_min`, `timezone=auto`
3.  **Historical (Recent)**: `https://archive-api.open-meteo.com/v1/archive`
    *   Params: `latitude`, `longitude`, `start_date`, `end_date`, `daily=temperature_2m_max,temperature_2m_min`
    *   *Strategy*: Make 5 parallel requests (one for each past year) OR 1 request for the full 5-year range?
    *   *Optimization*: 1 request for the full 5-year range is better for rate limits, but we only need specific 10-day windows. However, fetching the continuous 5-year chunk might be heavy.
    *   *Refined Strategy*: Open-Meteo Archive API is fast. We can fetch specific ranges. Actually, fetching the *same* 10-day window for 5 different years requires 5 separate ranges. The API supports `start_date` and `end_date`. It doesn't support multiple disjoint ranges in one call.
    *   *Decision*: Parallel `fetch` calls for the 5 historical years.
4.  **Historical (30-Year Records)**: `https://archive-api.open-meteo.com/v1/archive`
    *   Params: `start_date` (30 years ago), `end_date` (yesterday), `daily=temperature_2m_mean,snowfall_sum`
    *   *Data Volume*: 30 years * 365 days = ~11,000 data points. JSON size is manageable (~100-200KB).
    *   *Processing*: Calculate records client-side.

## 2. Tech Stack: Vite + Vanilla JS

**Decision**: Vite with Vanilla JavaScript.
**Rationale**:
- **Performance**: Lightweight, no framework overhead.
- **Simplicity**: Meets "Core" requirements.
- **Dev Experience**: Vite provides HMR and easy testing setup.
- **CSS**: Vanilla CSS with CSS Variables for theming (Hot/Cold colors).

## 3. UI/UX: Sticky Columns & Responsive Table

**Decision**: CSS Grid + `position: sticky`.
**Rationale**:
- `position: sticky` works well on `th` and `td` elements.
- CSS Grid allows precise alignment of the "Forecast" vs "History" rows.
- **Mobile**: Horizontal scroll for the days, vertical scroll for the page. Sticky first column (Labels) keeps context.

## 4. Date Handling

**Decision**: Native `Date` object + `Intl.DateTimeFormat`.
**Rationale**: Modern browsers handle dates well. No need for `moment.js` or `date-fns` unless complex math is needed.
**Edge Case**: Leap years.
- *Logic*: When mapping "Today" to "Today - 1 Year", if Today is Feb 29, Last Year (non-leap) should map to Mar 1 (as per spec).
- *Implementation*: `date.setFullYear(year - n)`. Check if month changed unexpectedly.

## 5. Testing Strategy

**Decision**:
- **Unit**: Vitest for `WeatherService` (API calls) and `DataProcessor` (Record calculations, Leap year logic).
- **E2E**: Playwright for checking the UI rendering and "Sticky" behavior (visual regression optional but overkill here).
