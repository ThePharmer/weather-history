import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api/geocoding': {
                target: 'https://geocoding-api.open-meteo.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/geocoding/, ''),
                secure: false,
            },
            '/api/forecast': {
                target: 'https://api.open-meteo.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/forecast/, ''),
                secure: false,
            },
            '/api/archive': {
                target: 'https://archive-api.open-meteo.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/archive/, ''),
                secure: false,
            },
        },
    },
});
