import { logout } from '../api/auth.js';
import { isAuthenticated } from '../api/auth.js';
import { renderHeader } from '../partials/header.js'
import { renderFooter } from '../partials/footer.js';


export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }
    app.innerHTML += `
        
        <div class="container mt-5 text-center">
            <h1>Logging Out...</h1>
        </div>
    `;
    renderFooter(app);

    try {
        await logout();
        window.location.href = '/login';
    } catch (error) {
        app.innerHTML += `
            <div class="alert alert-danger mt-3">
                Error logging out: ${error.message}
            </div>
        `;
    }
};
