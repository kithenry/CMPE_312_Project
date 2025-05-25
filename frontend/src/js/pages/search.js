import { isAuthenticated, apiRequest } from '../api/auth.js';
import { renderHeader } from '../partials/header.js';
import { getBooks } from '../api/books.js';
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
	console.log(`The user is ${user}`);
        userId = user.id;
    } catch (error) {
        if (error.message.includes('Authentication')) {
            window.location.href = '/login';
            return;
        }
    }

    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center pb-3">Search Available Books</h1>
            <div class="mb-3">
                <select id="filter-select" class="form-select mb-2" style="max-width: 300px;">
                    <option value="all">All Books</option>
                    <option value="my">My Books</option>
                    <option value="others">Others' Books</option>
                </select>
                <input type="text" class="form-control p-3" id="search-input" placeholder="Search by title or course...">
            </div>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="book-grid" class="row row-cols-1 row-cols-md-3 g-4"></div>
        </div>
    `;
    renderFooter(app);

    const searchInput = document.getElementById('search-input');
    const errorDiv = document.getElementById('error');
    const bookGrid = document.getElementById('book-grid');
    const filterSelect = document.getElementById('filter-select');

    const updateBooks = async (query = '', filter = 'all') => {
        bookGrid.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        try {
	    console.log(`The userid is ${userId}`);
            const books = await getBooks(filter, userId, query);
            bookGrid.innerHTML = '';
            if (books.length === 0) {
                bookGrid.innerHTML = '<div class="alert alert-warning">No books found</div>';
                return;
            }
            books.forEach(book => {
                bookGrid.innerHTML += `
                    <div class="col">
                        <div class="card h-100 shadow-sm p-3" onclick="window.location.href='/book-view?id=${book.id}'" style="cursor: pointer;">
                            <img src="${book.cover_image || 'https://miro.medium.com/v2/resize:fit:1400/1*s_BUOauMhzRZL0dBiCExww.png'}" class="card-img-top" alt="${book.title}">
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
        updateBooks(e.target.value, filterSelect.value);
    });

    filterSelect.addEventListener('change', (e) => {
        updateBooks(searchInput.value, e.target.value);
    });

    await updateBooks();
};
