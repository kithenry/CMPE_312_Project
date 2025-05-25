// src/js/pages/transactions.js
import { apiRequest, isAuthenticated } from '../api/auth.js';
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    app.innerHTML += `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/profile">Profile</a></li>
                        <li class="nav-item"><a class="nav-link" href="/transactions">Transactions</a></li>
                        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5">
            <h1 class="text-center">My Transactions</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="transaction-list" class="list-group"></div>
        </div>
    `;
    renderFooter(app);

    const errorDiv = document.getElementById('error');
    const transactionList = document.getElementById('transaction-list');

    try {
        const transactions = await apiRequest('http://localhost:8000/api/transactions/');
        transactionList.innerHTML = '';
        if (transactions.length === 0) {
            transactionList.innerHTML = '<div class="alert alert-warning">No transactions found</div>';
            return;
        }
        transactions.forEach(transaction => {
            transactionList.innerHTML += `
                <div class="list-group-item">
                    <h5 class="mb-1">Transaction #${transaction.id}</h5>
                    <p class="mb-1">Book: ${transaction.book_title || 'N/A'}</p>
                    <p class="mb-1">Status: ${transaction.status || 'Pending'}</p>
                    <p class="mb-1">Date: ${new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>`;
        });
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = 'Error loading transactions: ' + error.message;
    }
};
