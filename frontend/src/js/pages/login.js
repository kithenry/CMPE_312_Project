// src/js/pages/login.js
import { login } from '../api/auth.js';

export default (app) => {
    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
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
