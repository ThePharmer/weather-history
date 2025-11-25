# Internal API Interface

Since we are consuming an external API (Open-Meteo), this contract defines the **internal interface** that our application's `WeatherService` will expose to the UI components. This ensures modularity and allows us to swap the API provider if needed.

## WeatherService

### `getForecast(lat, lon)`

Fetches the 10-day forecast for the given coordinates.

- **Input**:
    - `lat` (number): Latitude
    - `lon` (number): Longitude
- **Output**: `Promise<DailyWeather[]>`
    - Returns an array of 10 `DailyWeather` objects (Temperatures in Fahrenheit).

### `getHistory(lat, lon, startDate, endDate)`

Fetches historical weather data for a specific range.

- **Input**:
    - `lat` (number): Latitude
    - `lon` (number): Longitude
    - `startDate` (string): YYYY-MM-DD
    - `endDate` (string): YYYY-MM-DD
- **Output**: `Promise<DailyWeather[]>`

### `getHistoricalComparison(lat, lon, forecastDates)`

Fetches 5 years of historical data matching the provided forecast dates.

- **Input**:
    - `lat` (number): Latitude
    - `lon` (number): Longitude
    - `forecastDates` (string[]): Array of 10 YYYY-MM-DD strings (the forecast window)
- **Output**: `Promise<Map<number, DailyWeather[]>>`
    - Returns a Map where key is the Year (number) and value is array of 10 `DailyWeather` objects corresponding to the forecast window in that year.

### `getRecords(lat, lon)`

Calculates extreme weather records from the past 30 years.

- **Input**:
    - `lat` (number): Latitude
    - `lon` (number): Longitude
- **Output**: `Promise<WeatherRecord[]>`
    - Returns list of records (Warmest Week, Coldest Week, Snowfall dates).

### `searchCity(query)`

Searches for a city by name.

- **Input**:
    - `query` (string): City name
- **Output**: `Promise<Location[]>`
    - Returns list of matching locations.
