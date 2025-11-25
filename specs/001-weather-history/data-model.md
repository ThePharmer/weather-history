# Data Model: Weather History & Analysis

## Entities

### Location
Represents the user's selected location.

| Field | Type | Description |
|-------|------|-------------|
| `latitude` | `number` | Decimal latitude |
| `longitude` | `number` | Decimal longitude |
| `name` | `string` | City name (e.g., "London") |
| `country` | `string` | Country name/code |
| `timezone` | `string` | IANA timezone (e.g., "Europe/London") |

### DailyWeather
Represents weather data for a single day (forecast or history).

| Field | Type | Description |
|-------|------|-------------|
| `date` | `string` | ISO 8601 Date (YYYY-MM-DD) |
| `maxTemp` | `number` | Maximum temperature (°C) |
| `minTemp` | `number` | Minimum temperature (°C) |
| `weatherCode` | `number` | WMO Weather code (0-99) |
| `isForecast` | `boolean` | True if forecast, False if historical |

### WeatherComparison
Represents the aggregated data for a specific calendar day (e.g., "Nov 24") across multiple years.

| Field | Type | Description |
|-------|------|-------------|
| `displayDate` | `string` | Formatted date (e.g., "Sun, Nov 24") |
| `forecast` | `DailyWeather` | The forecast for this day |
| `history` | `DailyWeather[]` | Array of historical data for this day (Year -1 to -5) |
| `averageMax` | `number` | Average max temp of history years |
| `averageMin` | `number` | Average min temp of history years |

### WeatherRecord
Represents an extreme weather event from the past 30 years.

| Field | Type | Description |
|-------|------|-------------|
| `type` | `enum` | `WARMEST_WEEK`, `COLDEST_WEEK`, `EARLIEST_SNOW`, etc. |
| `value` | `number` | The temperature or date value |
| `startDate` | `string` | Start date of the event |
| `endDate` | `string` | End date of the event (if range) |
| `year` | `number` | Year the record occurred |

## State Management

The application state will be simple and contained in a central store or object:

```javascript
const state = {
  currentLocation: null, // Location object
  isLoading: false,
  error: null,
  forecastData: [], // Array of DailyWeather
  historicalData: {}, // Map of year -> DailyWeather[]
  records: [], // Array of WeatherRecord
  unit: 'F' // 'F' or 'C'
};
```
