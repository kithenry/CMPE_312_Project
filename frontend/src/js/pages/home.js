// src/js/pages/home.js
export default (app) => {
    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
            </div>
        </nav>
        <div class="container text-center py-5">
            <h1 class="display-4">Welcome to UniBookSwap</h1>
        </div>
    `;
};
