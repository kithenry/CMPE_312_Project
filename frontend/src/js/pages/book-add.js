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
    
    app.innerHTML += `
        
        <div class="container mt-5" style="max-width: 500px;">
            <h1 class="text-center">Add a Book</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="success" class="alert alert-success d-none"></div>
            <form id="book-add-form" enctype="multipart/form-data">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" required>
                </div>
                <div class="mb-3">
                    <label for="isbn" class="form-label">ISBN (13 digits)</label>
                    <input type="text" class="form-control" id="isbn" pattern="\\d{13}" required>
                </div>
                <div class="mb-3">
                    <label for="course" class="form-label">Course</label>
                    <input type="text" class="form-control" id="course">
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">Price ($)</label>
                    <input type="number" step="0.01" class="form-control" id="price" required>
                </div>
             
               
                <div class="mb-3">
                    <label for="cover_image" class="form-label">Cover Image</label>
                    <input type="file" class="form-control" id="cover_image" accept="image/*">
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Book</button>
            </form>
        </div>
    `;
    renderFooter(app);

    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    document.getElementById('book-add-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const isbn = document.getElementById('isbn').value;
        const course = document.getElementById('course').value;
        const price = parseFloat(document.getElementById('price').value);
        // const exchange_option = document.getElementById('exchange_option').checked ? 1 : 0;
        // const status = document.getElementById('status').value;
        const cover_image = document.getElementById('cover_image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('isbn', isbn);
        formData.append('course', course || '');
        formData.append('price', price);
	formData.append('user_id', userId);
        // formData.append('exchange_option', exchange_option);
        // formData.append('status', status);
        if (cover_image) formData.append('cover_image', cover_image);

        try {
            const response = await apiRequest('http://localhost:8000/api/books/', {
                method: 'POST',
                body: formData
            });
            successDiv.classList.remove('d-none');
            successDiv.textContent = 'Book added successfully';
            errorDiv.classList.add('d-none');
            document.getElementById('book-add-form').reset();
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error adding book: ' + error.message;
            successDiv.classList.add('d-none');
            console.error('Error details:', error); // Debug
        }
    });
};
