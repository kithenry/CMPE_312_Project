// src/js/pages/login.js
import { login } from '../api/auth.js';
import { isAuthenticated } from '../api/auth.js';

export default (app) => {
    if (isAuthenticated()) {
        window.location.href = '/home';
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
        <div class="container mt-5" style="max-width: 400px;">
            <h1 class="text-center">Login</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <form id="login-form">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
        </div>
    `;

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error');

        try {
            await login(email, password);
            window.location.href = '/home';
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = error.message;
        }
    });
};
