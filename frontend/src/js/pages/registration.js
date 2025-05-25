// src/js/pages/registration.js
import { apiRequest } from '../api/auth.js';
import { isAuthenticated } from '../api/auth.js';

import { renderFooter } from '../partials/footer.js';

export default (app) => {

    if (isAuthenticated()) {
        window.location.href = '/home';
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
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item"><a class="nav-link" href="/register">Register</a></li>
                            <li class="nav-item"><a class="nav-link" href="/login">Forgot Password?</a></li>
                    </ul>
                    
                </div>
            </div>
        </nav>
        <div class="container mt-5" style="max-width: 400px;">
            <h1 class="text-center">Register</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <form id="register-form">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="password1" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password1" required>
                </div>
                <div class="mb-3">
                    <label for="password2" class="form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="password2" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Register</button>
            </form>
        </div>
    `;
    renderFooter(app);

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password1 = document.getElementById('password1').value;
        const password2 = document.getElementById('password2').value;
        const errorDiv = document.getElementById('error');

        if (password1 !== password2) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Passwords do not match';
            return;
        }

        try {
            const response = await apiRequest('http://localhost:8000/api/auth/registration/', {
                method: 'POST',
                body: JSON.stringify({ email, password1, password2 }),
		skipAuth: true
            });
            errorDiv.classList.add('d-none');
            window.location.href = '/login';
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = error.message || 'Registration failed';
        }
    });
};
