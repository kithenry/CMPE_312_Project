import { apiRequest, isAuthenticated } from '../api/auth.js';
import { renderFooter } from '../partials/footer.js';
import { renderHeader } from '../partials/header.js';

export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    app.innerHTML += `
        
        <div class="container profile-page mt-5" style="max-width: 500px;">
            <h1 class="text-center">User Profile</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="success" class="alert alert-success d-none"></div>
	    <div class='prof-div'>
	        <img src='' style={'border-radius:50%; height:200px'} id='prof_pic' />
	    </div>
            <form id="profile-form">
	        <div class="mb-3">
                     <label for="profile_pic" class="form-label">Profile Picture</label>
                     <input type="file" class="form-control" id="profile_picture" accept="image/*">
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" readonly>
                </div>
                <div class="mb-3">
                    <label for="first_name" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="first_name">
                </div>
                <div class="mb-3">
                    <label for="last_name" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="last_name">
                </div>
		<div class="mb-3">
                    <label for="user_name" class="form-label">Username</label>
                    <input type="text" class="form-control" id="user_name">
                </div>

                <button type="submit" class="btn btn-primary w-100">Update Profile</button>
            </form>
        </div>
    `;
    renderFooter(app);

    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const prof_pic = document.getElementById('prof_pic');
    const emailInput = document.getElementById('email');
    const coverImage = document.getElementById('cover_image');
    const firstNameInput = document.getElementById('first_name');
    const lastNameInput = document.getElementById('last_name');
    const userNameInput = document.getElementById('user_name');

    try {
        const user = await apiRequest('http://localhost:8000/api/users/me/');
        emailInput.value = user.email || '';
        firstNameInput.value = user.first_name || '';
        lastNameInput.value = user.last_name || '';
	userNameInput.value = user.user_name || '';
	prof_pic.src = 'http://localhost:8000/' + user.profile_picture || '';
	console.log(user.profile_picture);
	console.log(prof_pic);
	console.log(user);
	
	console.log(user);
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = 'Error loading profile: ' + error.message;
        return;
    }

    document.getElementById('profile-form').addEventListener('submit', async (e) => {
        e.preventDefault();
	const profile_picture = document.getElementById('profile_picture').files[0];
        const first_name = firstNameInput.value;
        const last_name = lastNameInput.value;
	const user_name = userNameInput.value;

	const formData = new FormData();
	formData.append('first_name', first_name);
	formData.append('last_name',last_name);
	formData.append('user_name',user_name);
	if (profile_picture) formData.append('profile_picture',profile_picture);

        try {
            await apiRequest('http://localhost:8000/api/users/me/', {
                method: 'PATCH',
                //body: JSON.stringify({ first_name, last_name })
		body: formData
            });
            successDiv.classList.remove('d-none');
            successDiv.textContent = 'Profile updated successfully';
            errorDiv.classList.add('d-none');
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error updating profile: ' + error.message;
            successDiv.classList.add('d-none');
        }
    });
};
