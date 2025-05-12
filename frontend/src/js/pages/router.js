// src/js/pages/router.js
export const loadPage = (path) => {
    const app = document.getElementById('app');
    let page = 'home';
    if (path === '/login') page = 'login';
    else if (path === '/register') page = 'registration';
    // Add more routes as needed
    import(`./${page}.js`).then(module => {
        app.innerHTML = ''; // Clear previous content
        module.default(app); // Call the page render function
    }).catch(err => console.error('Page load error:', err));
};
