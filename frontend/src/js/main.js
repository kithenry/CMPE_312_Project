// src/js/main.js
import { loadPage } from './pages/router.js';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    loadPage(path);
});

window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
});

