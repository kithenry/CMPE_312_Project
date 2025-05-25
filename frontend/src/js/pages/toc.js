// frontend/src/js/pages/toc.js
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center">Table of Contents</h1>
            <div class="list-group">
                <a href="#" class="list-group-item list-group-item-action">Introduction to UniBookSwap</a>
                <a href="#" class="list-group-item list-group-item-action">How to Get Started</a>
                <a href="#" class="list-group-item list-group-item-action">Listing Your Books</a>
                <a href="#" class="list-group-item list-group-item-action">Initiating Transactions</a>
                <a href="#" class="list-group-item list-group-item-action">Confirming and Rating Transactions</a>
                <a href="#" class="list-group-item list-group-item-action">Frequently Asked Questions</a>
                <a href="#" class="list-group-item list-group-item-action">Contact and Support</a>
            </div>
            <p class="text-center mt-3">This is a dummy TOC for demonstration purposes.</p>
        </div>
    `;
    renderFooter(app); // Ensure footer is rendered
};
