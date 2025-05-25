// frontend/src/js/pages/book-view.js
import { apiRequest, isAuthenticated } from '../api/auth.js';
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
        app.innerHTML = `
            <div class="alert alert-danger text-center mt-5">
                Error loading user data: ${error.message}. Please log in again.
            </div>
        `;
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('id');

    if (!bookId) {
        app.innerHTML += `<div class="alert alert-danger text-center mt-5">No book ID provided.</div>`;
        return;
    }

    let book;
    try {
        book = await apiRequest(`http://localhost:8000/api/books/${bookId}/`);
    } catch (error) {
        app.innerHTML += `<div class="alert alert-danger text-center mt-5">Error loading book: ${error.message}</div>`;
        return;
    }

    const isOwner = book.user_id === userId;
    const isAvailable = book.quantity > 0;

    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center">${book.title}</h1>
            <div class="row">
                <div class="col-md-6">
                    <img src="${book.cover_image}" alt="${book.title}" class="img-fluid">
                </div>
	      
                <div class="col-md-6">
                    <h3>Details</h3>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>Course:</strong> ${book.course}</p>
                    <p><strong>Price:</strong> $${book.price}</p>
                    <p><strong>Quantity:</strong> ${book.quantity}</p>
                    <p><strong>Owner:</strong> ${book.user_id}</p>
                    ${!isOwner && isAvailable ? `
                        <button id="initiate-transaction" class="btn btn-primary">Initiate Transaction</button>
                    ` : isOwner ? `
                          <div class="mt-4">
                            <h3>Edit Book</h3>
                            <form id="edit-book-form" enctype="multipart/form-data">
                                <div class="mb-3">
                                    <label for="title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="title" value="${book.title}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="price" class="form-label">Price ($)</label>
                                    <input type="number" step="0.01" class="form-control" id="price" value="${book.price}" required>
                                </div>  
				<div class="mb-3">
                                    <label for="price" class="form-label">Quantity </label>
                                    <input type="number" step="0.01" class="form-control" id="quantity" value="${book.quantity}" required>
                                </div>

                                <div class="mb-3">
                                    <label for="isbn" class="form-label">ISBN (13 digits)</label>
                                    <input type="text" class="form-control" id="isbn" pattern="\\d{13}" value="${book.isbn}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="cover_image" class="form-label">Cover Image</label>
                                    <input type="file" class="form-control" id="cover_image" accept="image/*">
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Update Book</button>
                                <button type="button" id="delete-btn" class="btn btn-danger w-100 mt-2">Delete Book</button>
                            </form>
                        </div>

                    ` : `
                        <p class="text-danger">This book is out of stock.</p>
                    `}
                </div>
		<div id="error" class="alert alert-danger d-none"></div>
                <div id="success" class="alert alert-success d-none"></div>
	
            </div>
        </div>
    `;
    renderFooter(app);
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    if (!isOwner && isAvailable) {
        document.getElementById('initiate-transaction').addEventListener('click', async () => {
            try {
                // Create a new transaction
                const transaction = await apiRequest('http://localhost:8000/api/transactions/', {
                    method: 'POST',
                    body: JSON.stringify({
                        book: bookId,
                        type: 'sale',
			buyer: userId,
			seller: book.user_id
                    })
                });

                // Redirect to chat page
                window.location.href = `/chat?transaction=${transaction.id}&user=${userId}&receiver=${book.user_id}`;
            } catch (error) {
                alert(`Error initiating transaction: ${error.message}`);
            }
        });
    } else {

	document.getElementById('edit-book-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const price = parseFloat(document.getElementById('price').value);
	    const quantity = parseInt(document.getElementById('quantity').value);
            const isbn = document.getElementById('isbn').value;
            const cover_image = document.getElementById('cover_image').files[0];

            const formData = new FormData();
            formData.append('title', title);
            formData.append('price', price);
	    formData.append('quantity',quantity);
            formData.append('isbn', isbn);
            if (cover_image) formData.append('cover_image', cover_image);

            try {
                await apiRequest(`http://localhost:8000/api/books/${bookId}/`, {
                    method: 'PATCH',
                    body: formData
                });
                successDiv.classList.remove('d-none');
                successDiv.textContent = 'Book updated successfully';
                errorDiv.classList.add('d-none');
		console.log('time out next');
                setTimeout(() => window.location.reload(), 1000);
            } catch (error) {
                errorDiv.classList.remove('d-none');
                errorDiv.textContent = `Error updating book: ${error.message}`;
                successDiv.classList.add('d-none');
            }
        });

        document.getElementById('delete-btn').addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this book?')) return;
            try {
                await apiRequest(`http://localhost:8000/api/books/${bookId}/`, {
                    method: 'DELETE'
                });
                successDiv.classList.remove('d-none');
                successDiv.textContent = 'Book deleted successfully';
                errorDiv.classList.add('d-none');
                setTimeout(() => window.location.href = '/search', 1000);
            } catch (error) {
                errorDiv.classList.remove('d-none');
                errorDiv.textContent = `Error deleting book: ${error.message}`;
                successDiv.classList.add('d-none');
            }
        });

    }
};
