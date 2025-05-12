// src/js/api/auth.js
const API_URL = 'http://localhost:8000/api/';

// Helper to get tokens from localStorage
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

// Helper to set tokens in localStorage
export const setTokens = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

// Helper to clear tokens
export const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

// Check if user is authenticated
export const isAuthenticated = () => !!getAccessToken();

// Login
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (response.ok) {
        setTokens(data.access, data.refresh);
        return data;
    } else {
        throw new Error(data.non_field_errors?.[0] || 'Login failed');
    }
};

// Refresh token
export const refreshToken = async () => {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error('No refresh token available');

    const response = await fetch(`${API_URL}auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
    });
    const data = await response.json();
    if (response.ok) {
        setTokens(data.access, data.refresh);
        return data.access;
    } else {
        clearTokens();
        throw new Error('Token refresh failed');
    }
};

// Logout
export const logout = async () => {
    const refresh = getRefreshToken();
    if (refresh) {
        await fetch(`${API_URL}auth/logout/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh })
        });
    }
    clearTokens();
};

// Generic API request with token handling
export const apiRequest = async (url, options = {}) => {
    const accessToken = getAccessToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
    };

    let response = await fetch(url, { ...options, headers });
    if (response.status === 401) {
        try {
            const newToken = await refreshToken();
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, { ...options, headers });
        } catch (error) {
            clearTokens();
            window.location.href = '/login';
            throw error;
        }
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || 'Request failed');
    }
    return data;
};
