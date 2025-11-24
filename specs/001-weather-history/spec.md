# Feature Specification: Weather History & Analysis

**Feature Branch**: `001-weather-history`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "Auto-detects your location on load... 10-day forecast... Past 5 years of data... Extreme weather analysis..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compare Forecast with History (Priority: P1)

As a user, I want to see the 10-day forecast alongside the last 5 years of weather for those same dates so I can understand if the current weather is typical or anomalous.

**Why this priority**: This is the core value proposition of the app—providing historical context to the forecast.

**Independent Test**: Can be tested by loading the app and verifying that the forecast row and 5 history rows appear with correct dates and temperature data.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user views the main table, **Then** the top row shows the 10-day forecast (High/Low, Icons).
2. **Given** the forecast is displayed, **When** the user looks at the rows below, **Then** they see data for the same 10 dates for the past 5 years (e.g., if today is Nov 24, rows show Nov 24-Dec 3 for 2024, 2023, 2022, 2021, 2020).
3. **Given** the history rows, **When** a historical temp is higher than the forecast temp for that day, **Then** the cell is colored Red/Orange.
4. **Given** the history rows, **When** a historical temp is lower than the forecast temp for that day, **Then** the cell is colored Blue.

---

### User Story 2 - Extreme Weather Analysis (Priority: P2)

As a user, I want to see 30-year records for warmest/coldest weeks and snowfall dates so I can contextualize extreme weather events.

**Why this priority**: Adds depth to the analysis, allowing users to see beyond just the recent 5-year history.

**Independent Test**: Can be tested by verifying the "Records" section displays valid dates and values derived from 30 years of data.

**Acceptance Scenarios**:

1. **Given** the app is loaded, **When** the user scrolls to the analysis section, **Then** they see the "Warmest week on record" and "Coldest week on record" from the past 30 years.
2. **Given** the analysis section, **When** the user views snowfall data, **Then** they see "Earliest/Latest First Snowfall" and "Earliest/Latest Last Snowfall" based on 30 seasons.

---

### User Story 3 - Location Management (Priority: P1)

As a user, I want to auto-detect my location or search for a city so I can get relevant weather data for my area.

**Why this priority**: Essential for the app to be useful to the user.

**Independent Test**: Can be tested by granting location permissions (auto-detect) and by typing a city name (search).

**Acceptance Scenarios**:

1. **Given** the app is opened for the first time, **When** the user grants location permission, **Then** the weather data loads for their current coordinates.
2. **Given** the app is loaded, **When** the user searches for "London", **Then** the weather data updates to show London's forecast and history.

---

### Edge Cases

- **EC-001 - API Unavailable**: If the weather API is unreachable or rate-limited, the system MUST display a user-friendly error message and a "Retry" button, rather than crashing or showing a blank screen.
- **EC-002 - Location Permission Denied**: If the user denies browser location permissions, the system MUST NOT block the UI. It should default to a prominent "Search for City" state or load a default city (e.g., New York) with a notification.
- **EC-003 - Leap Years**: When displaying historical data for February 29th:
    - If a past year is a leap year, use Feb 29th data.
    - If a past year is NOT a leap year, use March 1st data to maintain alignment.
- **EC-004 - Missing Data**: If historical data is missing for a specific date/location, the system MUST display a placeholder (e.g., "--" or "N/A") and NOT break the table layout or calculation of averages (exclude missing values from average).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically detect user location on load (requesting browser permissions).
- **FR-002**: System MUST allow users to search for a location by city name (using Open-Meteo Geocoding API or similar).
- **FR-003**: System MUST fetch and display a 10-day weather forecast (Daily High/Low temps, Weather Code/Icon) from Open-Meteo.
- **FR-004**: System MUST fetch and display historical weather data (Daily High/Low temps) for the same 10-day period for the past 5 years.
- **FR-005**: System MUST display data in a table format:
    - **Columns**: The 10 days (e.g., "Today", "Tomorrow", etc. or dates).
    - **Rows**: "Forecast" (top), followed by "Year -1", "Year -2", ... "Year -5".
    - **Sticky Column**: The first column (Row Headers: "Forecast", "2024", etc.) MUST be sticky on horizontal scroll.
- **FR-006**: System MUST color-code historical cells relative to the current forecast for that day:
    - **Warmer**: Red/Orange background.
    - **Colder**: Blue background.
- **FR-007**: System MUST display an "Average" column on the right of the table, showing the average temperature for that row's 10-day period (to show overall trends for that year).
- **FR-008**: System MUST fetch 30 years of historical data to calculate records.
- **FR-009**: System MUST calculate and display "Warmest week on record" (highest avg temp for a 7-day rolling window) from the past 30 years.
- **FR-010**: System MUST calculate and display "Coldest week on record" (lowest avg temp for a 7-day rolling window) from the past 30 years.
- **FR-011**: System MUST calculate and display Snowfall records from the past 30 seasons:
    - Earliest First Snowfall
    - Latest First Snowfall
    - Earliest Last Snowfall
    - Latest Last Snowfall
    - *Assumption*: Snowfall day defined as > 0.0 cm of snow or "Snow" weather code.
- **FR-012**: The interface MUST be responsive, suitable for both desktop and mobile web.

### Key Entities

- **Location**: Latitude, Longitude, City Name, Country.
- **DailyWeather**: Date, MaxTemp, MinTemp, WeatherCode.
- **WeatherRecord**: Type (WarmestWeek, ColdestWeek, Snowfall), Value (Date/Range, Temp).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: App loads and renders initial data (Forecast + 5y History) within 3 seconds on 4G network.
- **SC-002**: Location search returns valid results for major global cities 100% of the time.
- **SC-003**: Historical data is available for 100% of the requested dates (handling API gaps gracefully if any).
- **SC-004**: Mobile layout achieves a Google Lighthouse "SEO" and "Accessibility" score of >90.
