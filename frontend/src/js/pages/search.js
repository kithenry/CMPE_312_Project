// src/js/pages/search.js
import { getBooks } from '../api/books.js';

export default async (app) => {
    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/search">Search</a></li>
                        <li class="nav-item"><a class="nav-link" href="/book-add">Add Book</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5">
            <h1 class="text-center">Search Books</h1>
            <div class="mb-3">
                <input type="text" class="form-control" id="search-input" placeholder="Search by title or course...">
            </div>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="book-grid" class="row row-cols-1 row-cols-md-3 g-4"></div>
        </div>
    `;

    const searchInput = document.getElementById('search-input');
    const errorDiv = document.getElementById('error');
    const bookGrid = document.getElementById('book-grid');

    const updateBooks = async (query = '') => {
        bookGrid.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        try {
            const books = await getBooks();
            bookGrid.innerHTML = '';
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(query.toLowerCase()) ||
                book.course?.toLowerCase().includes(query.toLowerCase())
            );
            if (filteredBooks.length === 0) {
                bookGrid.innerHTML = '<div class="alert alert-warning">No books found</div>';
                return;
            }
            filteredBooks.forEach(book => {
                bookGrid.innerHTML += `
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
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error fetching books: ' + error.message;
        }
    };

    searchInput.addEventListener('input', (e) => {
        updateBooks(e.target.value);
    });

    // Initial load
    await updateBooks();
};
