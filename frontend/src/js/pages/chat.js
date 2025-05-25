// src/js/pages/chat.js
import { apiRequest, isAuthenticated, refreshToken } from '../api/auth.js';
import { renderHeader } from '../partials/header.js';
import { renderFooter } from '../partials/footer.js';

export default async (app) => {
    await renderHeader(app);
    if (!isAuthenticated()) {
	try{
	    refreshToken()
    } catch(error) {

	window.location.href = '/login';
        return;
	}
    }
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('transaction');
    const userId = params.get('user');
    // get userDetails via user.me api end point
     let user;
     try {
        user = await apiRequest('http://localhost:8000/api/users/me/');
        let userId = user.id;
    } catch (error) {
        if (error.message.includes('Authentication')) {
            // window.location.href = '/login';
           // return;
	    console.log('error');
        }
        app.innerHTML = `
            <div class="alert alert-danger text-center mt-5">
                Error loading user data: ${error.message}. Please log in again.
            </div>
        `;
        return;
    }
	 
    const otherId = params.get('receiver');
    // collect userName here
     let userName = 'dummy';
    // Placeholder transaction ID (replace with dynamic selection later)
     console.log(user);
    app.innerHTML += `
       
        <div class="container mt-5" style="max-width: 600px;">
            <h1 class="text-center">Transaction #${transactionId.slice(-5)}</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="chat-messages" class="border p-3 mb-3" style="height: 400px; overflow-y: auto;"></div>
            <form id="chat-form">
                <div class="input-group">
                    <input type="text" class="form-control" id="message-input" placeholder="Type a message..." required>
                    <button type="submit" class="btn btn-primary send-btn">Send</button>
                </div>
            </form>
        </div>
    `;
    renderFooter(app);

    const errorDiv = document.getElementById('error');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    let options;
    const loadMessages = async () => {
    try {
        const messages = await apiRequest(`http://localhost:8000/api/chat/${transactionId}/`, { skiAuth: true, method: 'GET' });
        chatMessages.innerHTML = '';
        console.log(messages);

        messages.forEach(msg => {
            const className = msg.sender === parseInt(userId) ? 'sender' : 'receiver';
            const senderName = msg.sender === parseInt(userId) ? 'You' : 'OtherUser';
            const time = new Date(msg.timestamp).toLocaleTimeString();

            chatMessages.innerHTML += `
                <div class="message ${className}">
                    <div class="message-bubble">
                        <strong>${senderName}:</strong> ${msg.content}
                        <div class="timestamp">${time}</div>
                    </div>
                </div>
            `;
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = 'Error loading messages: ' + error.message;
    }
    };

    const sendMessage = async (content) => {
        try {
            await apiRequest(`http://localhost:8000/api/chat/${transactionId}/`, {
                method: 'POST',
                body: JSON.stringify({content:content, sender:userId, receiver:otherId, transaction:transactionId })
            });
            messageInput.value = '';
            await loadMessages();
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error sending message: ' + error.message;
        }
    };

    document.getElementById('chat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        if (content) {
            await sendMessage(content);
        }
    });

    // Initial load and polling every 5 seconds
    await loadMessages();
    setInterval(loadMessages, 5000);
};
