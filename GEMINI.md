# weather-history Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-24

## Active Technologies
- `localStorage` (for caching last location and unit preference) (001-weather-history)

- JavaScript (ES6+), HTML5, CSS3 (Vanilla) (001-weather-history)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test; npm run lint

## Code Style

JavaScript (ES6+), HTML5, CSS3 (Vanilla): Follow standard conventions

## Recent Changes
- 001-weather-history: Added JavaScript (ES6+), HTML5, CSS3 (Vanilla)

- 001-weather-history: Added JavaScript (ES6+), HTML5, CSS3 (Vanilla)

## Lessons Learned

### CORS and External APIs (2025-11-24)

**Issue**: Browser-based apps making direct calls to third-party APIs encounter CORS restrictions.

**Solution**: 
- Always research API CORS policies BEFORE implementation
- Configure Vite proxy in initial setup for development
- For Open-Meteo specifically: use separate proxies for different subdomains
  - Geocoding: `geocoding-api.open-meteo.com`
  - Forecast: `api.open-meteo.com`
  - Archive: `archive-api.open-meteo.com`

**Prevention**:
1. Research external API structure and constraints first
2. Test minimal API call in browser before building full implementation
3. Include proxy configuration in initial Vite setup
4. Document production deployment needs (backend proxy or serverless functions)

### File Editing Best Practices (2025-11-24)

**Issue**: Multiple file corruptions from imprecise `replace_file_content` calls.

**Prevention**:
1. Always `view_file` before editing to see exact current state
2. Use `write_to_file` with `Overwrite: true` for major rewrites
3. Be extremely precise with `TargetContent` string matching
4. Avoid multiple sequential replacements on same file - combine into one operation

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
