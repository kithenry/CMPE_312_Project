// src/js/pages/book-add.js
import { apiRequest, isAuthenticated } from '../api/auth.js';

export default (app) => {
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
                        <li class="nav-item"><a class="nav-link" href="/profile">Profile</a></li>
                        <li class="nav-item"><a class="nav-link" href="/book-add">Add Book</a></li>
                        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5" style="max-width: 500px;">
            <h1 class="text-center">Add a Book</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="success" class="alert alert-success d-none"></div>
            <form id="book-add-form">
                <div class="mb-3">
                    <label for="title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="title" required>
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
                    <label for="status" class="form-label">Status</label>
                    <select class="form-select" id="status" required>
                        <option value="Available">Available</option>
                        <option value="Sold">Sold</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Book</button>
            </form>
        </div>
    `;

    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    document.getElementById('book-add-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const course = document.getElementById('course').value;
        const price = parseFloat(document.getElementById('price').value);
        const status = document.getElementById('status').value;

        try {
            await apiRequest('http://localhost:8000/api/books/', {
                method: 'POST',
                body: JSON.stringify({ title, course, price, status })
            });
            successDiv.classList.remove('d-none');
            successDiv.textContent = 'Book added successfully';
            errorDiv.classList.add('d-none');
            document.getElementById('book-add-form').reset();
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error adding book: ' + error.message;
            successDiv.classList.add('d-none');
        }
    });
};
