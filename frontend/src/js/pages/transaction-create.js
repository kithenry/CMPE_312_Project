// src/js/pages/transaction-create.js
import { apiRequest, isAuthenticated } from '../api/auth.js';
import { getBooks } from '../api/books.js';
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
                        <li class="nav-item"><a class="nav-link" href="/transactions">Transactions</a></li>
                        <li class="nav-item"><a class="nav-link" href="/transaction-create">Create Transaction</a></li>
                        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5" style="max-width: 500px;">
            <h1 class="text-center">Create Transaction</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="success" class="alert alert-success d-none"></div>
            <form id="transaction-form">
                <div class="mb-3">
                    <label for="book" class="form-label">Select Book</label>
                    <select class="form-select" id="book" required>
                        <option value="">Select a book</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-100">Create Transaction</button>
            </form>
        </div>
    `;
    renderFooter(app);

    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const bookSelect = document.getElementById('book');

    // Load available books
    try {
	console.log('loading book listing');
        const books = await getBooks();
	console.log(books);
        books.forEach(book => {
            if (book.status === 'available') {
                const option = document.createElement('option');
                option.value = book.id;
                option.textContent = `${book.title} (${book.course || 'N/A'}) - $${book.price || '0.00'}`;
                bookSelect.appendChild(option);
            }
        });
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = 'Error loading books: ' + error.message;
        return;
    }

    document.getElementById('transaction-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookId = bookSelect.value;

        try {
            await apiRequest('http://localhost:8000/api/transactions/', {
                method: 'POST',
                body: JSON.stringify({ book: bookId })
            });
            successDiv.classList.remove('d-none');
            successDiv.textContent = 'Transaction created successfully';
            errorDiv.classList.add('d-none');
            setTimeout(() => window.location.href = '/transactions', 2000);
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error creating transaction: ' + error.message;
            successDiv.classList.add('d-none');
        }
    });
};
