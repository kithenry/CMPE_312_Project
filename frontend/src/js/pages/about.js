// frontend/src/js/pages/about.js
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center">About UniBookSwap</h1>
            <p class="lead text-center">
                UniBookSwap is a platform designed to facilitate the buying and selling of textbooks among university students. 
                Our mission is to make education more affordable by connecting students directly with one another.
            </p>
            <p class="text-center">
                <a href="/toc" class="btn btn-primary">View Table of Contents</a>
            </p>
        </div>
    `;
    renderFooter(app); // Ensure footer is rendered
};
