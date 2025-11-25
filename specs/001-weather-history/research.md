# Research: Weather History & Analysis

## Unit Conversion Strategy

**Decision**: Fetch data in Fahrenheit (default) and convert to Celsius on the client-side.

**Rationale**:
- **Instant Toggle**: Users can switch units instantly without waiting for a network request.
- **Performance**: Reduces API calls and load on the server/API.
- **Simplicity**: Math for conversion is trivial (`(F - 32) * 5/9`).

**Alternatives Considered**:
- **Fetch both units**: Would double the payload size or require two requests. Rejected for performance.
- **Re-fetch on toggle**: Would cause a delay and "loading" state every time the user switches. Rejected for UX.

## API Constraints

**Decision**: Use Open-Meteo's `temperature_unit=fahrenheit` parameter.

**Rationale**:
- The spec requires Fahrenheit by default.
- Open-Meteo defaults to Celsius, so explicit parameter is needed.
