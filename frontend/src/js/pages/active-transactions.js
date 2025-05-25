// frontend/src/js/pages/active-transactions.js
import { apiRequest, isAuthenticated } from '../api/auth.js';
import { renderHeader } from '../partials/header.js';
import { getBooks } from '../api/books.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
	window.location.href = '/login';
	return;
    }

    let userId = null;

    try {
	const user = await apiRequest('http://localhost:8000/api/users/me/');
	userId = user.id;
    } catch (error) {
	if (error.message.includes('Authentication')) {
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
    // get username here
    let userName = 'dummyO';

    let transactions;
    try {
        transactions = await apiRequest('http://localhost:8000/api/transactions/');
        // Filter for not fully confirmed transactions
        transactions = transactions.filter(t => !t.full_confirm);
    } catch (error) {
        app.innerHTML += `<div class="alert alert-danger text-center mt-5">Error loading transactions: ${error.message}</div>`;
        return;
    }
    let books;
    try {
        books = await getBooks('all',userId,'');
	
    } catch (error) {
        app.innerHTML += `<div class="alert alert-danger text-center mt-5">Error loading books: ${error.message}</div>`;
        return;
    }

   function getBookDetails(book_id, param){
	for (const elem of books) {
        if (elem.id === book_id) {
            return elem[param]; // Bracket notation to access dynamic property
        }
    }
    	return null; // Optional: handle not found case
    }

    app.innerHTML += `
<div class="container chat-page mt-5">
    <h1 class="text-center">My Transactions</h1>
    ${transactions.length === 0 ? `
        <p class="text-center">No active transactions.</p>
    ` : `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Book</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${transactions.map(t => {
                    const isBuyer = t.buyer === userId;
                    const userConfirmed = isBuyer ? t.buyer_confirm : t.seller_confirm;
                    const pendingConfirmation = t.buyer_confirm && !t.seller_confirm ? 'Seller' :
                                                !t.buyer_confirm && t.seller_confirm ? 'Buyer' :
                                                !t.buyer_confirm && !t.seller_confirm ? 'Both' : 'None';

                    return `
                        <tr>
                            <td>${getBookDetails(t.book, 'title')}</td>
                            <td>${userId === t.buyer ? 'Purchase' : 'Sale'}</td>
                            <td>
                                ${
                                    pendingConfirmation === 'Both' ? 'No party has confirmed yet' :
                                    pendingConfirmation === 'None' ? 'Fully confirmed' :
                                    `Awaiting ${((userId === t.buyer && !t.buyer_confirm) || (userId === t.seller && !t.seller_confirm)) ? 'Your' : pendingConfirmation} Confirmation`
                                }
                            </td>
                            <td>
                                <button class="btn btn-primary confirm-btn" data-id="${t.id}" 
                                    ${t.canceled_by || userConfirmed ? 'disabled style="background-color: gray;"' : ''}>
                                    ${
                                        (t.canceled_by === 'buyer' && userId === t.buyer) ||
                                        (t.canceled_by === 'seller' && userId === t.seller)
                                            ? 'You canceled the transaction'
                                            : (t.canceled_by ? `${t.canceled_by} canceled the transaction` : (userConfirmed ? 'You Confirmed': 'Confirm') )
                                    }
                                </button>
				<button class='btn chat-btn'>
                                <a href="/chat?transaction=${t.id}&user=${userId === t.seller ? t.seller : t.buyer}&receiver=${userId === t.seller ? t.buyer : t.seller}" class="btn btn-secondary">Chat</a>
				</button>
                                <button class="btn btn-danger cancel-btn"   data-useris="${userId === t.buyer ? 'buyer':'seller'}"   data-id="${t.id}">Cancel</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `}
</div>

    `;
    renderFooter(app);

    document.querySelectorAll('.confirm-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const transactionId = e.target.getAttribute('data-id');
            try {
                await apiRequest(`http://localhost:8000/api/transactions/${transactionId}/`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        [userId === transactions.find(t => t.id === transactionId).buyer ? 'buyer_confirm' : 'seller_confirm']: true // found key is set to true by []
                    })
                });
                window.location.reload();
            } catch (error) {
                alert(`Error confirming transaction: ${error.message}`);
            }
        });
    });

    document.querySelectorAll('.cancel-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const transactionId = e.target.getAttribute('data-id');
	    const canceledBy = e.target.getAttribute('data-useris');
            try {
                await apiRequest(`http://localhost:8000/api/transactions/${transactionId}/`, {
                    method: 'PATCH',
                    body: JSON.stringify({
			    canceled_by: canceledBy // found key is set to true by []
                    })
                });
                window.location.reload();
            } catch (error) {
                alert(`Error confirming transaction: ${error.message}`);
            }
        });
    });

};
