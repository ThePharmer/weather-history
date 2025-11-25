# Tasks: Weather History & Analysis

**Feature**: Weather History App
**Branch**: `001-weather-history`
**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)

## Phase 1: Setup & Infrastructure

- [x] T001 Initialize Vite project with Vanilla JS template `package.json`
- [x] T002 Install dependencies (`date-fns`) `package.json`
- [x] T003 Create project directory structure (`src/api`, `src/components`, `src/utils`, `src/styles`) `src/`
- [x] T004 Define CSS variables for theme and weather colors (Hot/Cold) `src/styles/variables.css`
- [x] T005 Create unit tests for base API client `tests/unit/api/client.test.js`
- [x] T006 Implement base API client and error handling `src/api/client.js`
- [x] T007 Create unit tests for Date utilities `tests/unit/utils/date-utils.test.js`
- [x] T008 Implement Date utilities (formatting, leap year handling) `src/utils/date-utils.js`
- [x] T009 Create global state management (simple store) `src/state.js`

## Phase 2: Location Management (US3)

*Goal: User can find their location to fetch relevant data.*

- [x] T010 [US3] Create unit tests for Geocoding API wrapper `tests/unit/api/geocoding.test.js`
- [x] T011 [US3] Implement Open-Meteo Geocoding API wrapper `src/api/weather-api.js`
- [x] T012 [US3] Implement Browser Geolocation utility `src/utils/geo.js`
- [x] T013 [US3] Create Location Search Component UI `src/components/location-search.js`
- [x] T014 [US3] Integrate Search and Auto-detect logic in Main App `src/main.js`

## Phase 3: Forecast & History (US1)

*Goal: Display 10-day forecast vs 5-year history with comparison.*

- [x] T015 [US1] Create unit tests for Forecast & History API wrappers `tests/unit/api/weather.test.js`
- [x] T016 [US1] Implement Forecast API wrapper `src/api/weather-api.js`
- [x] T017 [US1] Implement Historical API wrapper (5-year parallel fetch) `src/api/weather-api.js`
- [x] T018 [US1] Create unit tests for Data Transformation `tests/unit/utils/transform.test.js`
- [x] T019 [US1] Implement Data Transformation (Merge Forecast + History dates) `src/utils/transform.js`
- [x] T020 [US1] Create Weather Table Component Structure `src/components/weather-table.js`
- [x] T021 [US1] Implement Sticky Column and Grid Layout `src/styles/table.css`
- [x] T022 [US1] Implement Temperature Color Coding Logic `src/utils/style-utils.js`
- [x] T023 [US1] Render Forecast Row with Icons `src/components/weather-table.js`
- [x] T024 [US1] Render 5-Year History Rows `src/components/weather-table.js`
- [x] T025 [US1] Implement "Average" Column Calculation `src/utils/transform.js`

## Phase 4: Extreme Weather Analysis (US2)

*Goal: Contextualize current weather with 30-year records.*

- [x] T026 [US2] Create unit tests for Record Calculation Logic `tests/unit/utils/analysis.test.js`
- [x] T027 [US2] Implement 30-year Historical Data Fetch `src/api/weather-api.js`
- [x] T028 [US2] Implement Record Calculation Logic (Warmest/Coldest Week, Snowfall) `src/utils/analysis.js`
- [x] T029 [US2] Create Analysis Panel Component `src/components/analysis-panel.js`
- [x] T030 [US2] Render Records in UI `src/components/analysis-panel.js`

## Phase 5: Polish & Cross-Cutting

- [x] T031 [Polish] Implement Responsive Mobile Layout (Horizontal Scroll) `src/styles/responsive.css`
- [x] T032 [Polish] Add Loading States and Error Messages `src/components/ui-status.js`
- [x] T033 [Polish] specific edge case handling (Leap years visual check) `src/components/weather-table.js`
- [x] T034 [Polish] Verify Analysis Panel responsiveness (Mobile/Desktop) `src/styles/responsive.css`
- [x] T035 [Verification] Run Lighthouse and Performance tests (SC-001, SC-004) `tests/audit`
- [x] T036 [Feature] Implement Unit Toggle State and Conversion Logic `src/utils/units.js`
- [x] T037 [Feature] Update API to fetch Fahrenheit and UI to support toggle `src/api/weather-api.js`

## Dependencies

- US3 (Location) -> US1 (Data) -> US2 (Analysis)
- T001-T009 (Setup) must be done before any UI work.

## Implementation Strategy

1.  **Skeleton**: Get the app running with hardcoded location (London).
2.  **Data Flow**: Fetch and log data to console.
3.  **UI Construction**: Build the table with dummy data.
4.  **Integration**: Connect real data to table.
5.  **Refinement**: Add styles and color coding.
