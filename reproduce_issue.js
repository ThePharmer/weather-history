import { get30YearHistory } from './src/api/weather-api.js';

// Mock fetch for Node environment (since we're running this in Node)
// We need to use node-fetch or similar, but since we don't have it installed,
// we might need to rely on the user's browser or use the existing tests.
// Wait, I can use the existing test infrastructure but modify it to make a real network request?
// No, tests usually mock fetch.

// Actually, I can use the `run_command` to run a script with `node`.
// Node 18+ has native fetch. Let's assume the user has a recent Node version.

global.fetch = fetch;

// Mock window for buildUrl
global.window = {
    location: {
        origin: 'http://localhost:5173'
    }
};

async function run() {
    try {
        console.log('Starting 30-year history fetch...');
        // London coordinates
        const data = await get30YearHistory(51.5074, -0.1278);
        console.log('Success!');
        console.log('Data keys:', Object.keys(data));
        if (data.daily) {
            console.log('Daily data length:', data.daily.time.length);
            console.log('First temp (max):', data.daily.temperature_2m_max[0]);
        }
    } catch (error) {
        console.error('Error occurred:');
        console.error(error);
    }
}

run();
