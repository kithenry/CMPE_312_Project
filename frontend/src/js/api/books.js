// unibookswap/frontend/src/js/api/books.js
export const getBooks = async (filter = 'all', userId = null, query = '') => {
    let url = 'http://localhost:8000/api/books/';
    const params = new URLSearchParams();
    console.log(filter, userId, query); 

    if (query) params.append('search', query); // search query
    if (filter === 'my') {
    if (userId) params.append('user_id', userId);
    } else if (filter === 'available_others' || filter === 'others') {
        if (userId) {
            // params.append('status', 'available');
            params.append('user_id__ne', userId); // Not equal to userId
        }
    }

    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
};
