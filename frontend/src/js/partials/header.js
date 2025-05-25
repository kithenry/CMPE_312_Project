import { apiRequest, isAuthenticated } from '../api/auth.js';

export const renderHeader = async (app) => {
    let isLoggedIn = isAuthenticated();
      if (!isLoggedIn) {
        window.location.href = '/login';
        return;
    }

    let userId = null;

    try {
        const user = await apiRequest('http://localhost:8000/api/users/me/');
        userId = user.id;
    } catch (error) {
        if (error.message.includes('Authentication')) {
	    console.log('error');
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


    //const isLoggedIn = !!user;
    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        ${isLoggedIn ? `
                            <li class="nav-item"><a class="nav-link" href="/search">Search</a></li>
                            <li class="nav-item"><a class="nav-link" href="/book-add">Add Book</a></li>
                            <li class="nav-item"><a class="nav-link" href="/active-transactions">Manage Transactions</a></li>
                        
                        ` : `
                            <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
                            <li class="nav-item"><a class="nav-link" href="/register">Sign Up</a></li>
                        `}
                    </ul>
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="/profile">User Profile</a></li>
                            <li class="breadcrumb-item"><a href="/logout">Logout</a></li>
                        </ol>
                    </nav>
                </div>
            </div>
        </nav>
    `;
};
