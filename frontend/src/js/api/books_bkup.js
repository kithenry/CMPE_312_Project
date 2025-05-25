// src/js/api/books.js
import { apiRequest } from './auth.js';

const API_URL = 'http://localhost:8000/api/';

export const getBooks = async () => {
    return await apiRequest(`${API_URL}books/`);
};
