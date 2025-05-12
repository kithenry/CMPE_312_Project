// src/js/pages/home.js
import { getBooks } from '../api/books.js';
import { isAuthenticated } from '../api/auth.js';

export default async (app) => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
                        <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
                        <li class="nav-item"><a class="nav-link" href="/search">Search</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container text-center py-5">
            <h1 class="display-4">Welcome to UniBookSwap</h1>
            <h2 class="mb-4">Buy, Sell, Exchange</h2>
            <img src="src/assets/images/hero/books.jpg" alt="Books" class="img-fluid mb-4">
            <a href="/search" class="btn btn-primary btn-lg">Browse Books</a>
        </div>
        <div class="container">
            <div id="book-grid" class="row row-cols-1 row-cols-md-3 g-4"></div>
        </div>
    `;

    const grid = document.getElementById('book-grid');
    grid.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

    try {
        const books = await getBooks();
        grid.innerHTML = '';
        if (books.length === 0) {
            grid.innerHTML = '<div class="alert alert-warning">No books found</div>';
            return;
        }
        books.forEach(book => {
            grid.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="https://via.placeholder.com/300x200?text=${book.title}" class="card-img-top" alt="${book.title}">
                        <div class="card-body">
                            <h5 class="card-title">${book.title}</h5>
                            <p class="card-text">${book.course || 'N/A'} - $${book.price || '0.00'}</p>
                            <p class="card-text">${book.status || 'Available'}</p>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        grid.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
    }
};
