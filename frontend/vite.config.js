i// frontend/vite.config.js
export default {
    root: 'src', // Serve files from src/ as the root
    server: {
        proxy: {
            '/api': 'http://localhost:8000', // Proxy API requests to back-end
        },
    },
    build: {
        outDir: '../dist', // Output to dist/ outside src/
        emptyOutDir: true, // Clear dist/ before building
    },
};
