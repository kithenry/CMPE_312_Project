import { isAuthenticated, apiRequest } from '../api/auth.js';
import { getBooks } from '../api/books.js';
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    let userId = null;

    try {
        const user = await apiRequest('http://localhost:8000/api/users/me/');
        userId = user.id;
    } catch (error) {
        if (error.message.includes('Authentication')) {
            window.location.href = '/login';
            return;
        }
        app.innerHTML += `
            <div class="alert alert-danger text-center mt-5">
                Error loading user data: ${error.message}. Please log in again.
            </div>
        `;
        return;
    }


    // const userId = (await getBooks('my', (await isAuthenticated()).id))?.[0]?.user_id || null;
     app.innerHTML += `
       <div class='home-page'>
        <div class="container text-center py-5">
            <h1 class="display-4">Welcome to UniBookswap</h1>
            <h2 class="mb-4">Buy, Sell, Exchange <br/> Books.. </h2>
            <img width="300px" height="600px" src="/assets/images/hero/books.png" alt="Books" class="img-fluid mb-4">
            <br/>
        </div>
        <div class="container">
            <div class="mb-3">
                <select id="filter-select" class="form-select" style="max-width: 300px; margin: 0 auto;">
                    <option value="all">All Books</option>
                    <option value="my">My Listings</option>
                    <option value="available_others">Available from Others</option>
                </select>
            </div>
            <div id="book-grid" class="row row-cols-1 row-cols-md-3 g-4"></div>
            <br/>
            <a href="/search" class="btn btn-primary btn-lg">Browse More..</a>
        </div>
        </div>
    `;
    renderFooter(app);

    const grid = document.getElementById('book-grid');
    const filterSelect = document.getElementById('filter-select');

    const refreshBooks = async (filter) => {
        grid.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
        try {
            const books = await getBooks(filter, userId);
            grid.innerHTML = '';
            if (books.length === 0) {
                grid.innerHTML = '<div class="alert alert-warning">No books found</div>';
                return;
            }

            const limitedBooks = books.slice(0, Math.min(6, books.length));
            if (limitedBooks.length === 0) {
                grid.innerHTML = `<p class="text-center">No books available.</p>`;
            } else {
                limitedBooks.forEach(book => {
                    grid.innerHTML += `
                        <div class="col">
                            <div class="card h-100 shadow-sm p-3" onclick="window.location.href='/book-view?id=${book.id}'">
                                <img src="${book.cover_image || 'https://miro.medium.com/v2/resize:fit:1400/1*s_BUOauMhzRZL0dBiCExww.png'}" class="card-img-top" alt="${book.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">${book.course || 'N/A'} - $${book.price || '0.00'}</p>
                                    <p class="card-text">${book.status || 'Available'}</p>
                                </div>
                            </div>
                        </div>`;
                });
            }
        } catch (error) {
            grid.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
    };

    filterSelect.addEventListener('change', (e) => refreshBooks(e.target.value));
    refreshBooks('all'); // Initial load with all books
};
