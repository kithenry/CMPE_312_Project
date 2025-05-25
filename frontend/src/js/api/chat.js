import { renderHeader } from '../header.js';
import { apiRequest, isAuthenticated } from '../api/auth.js';

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


    const urlParams = new URLSearchParams(window.location.search);
    const transactionId = urlParams.get('transaction');
    const otherUserId = urlParams.get('user');

    if (!transactionId || !otherUserId) {
        app.innerHTML += '<div class="alert alert-danger text-center mt-5">Invalid chat parameters.</div>';
        return;
    }

    let messages = [];
    try {
        messages = await apiRequest(`http://localhost:8000/api/messages/?transaction=${transactionId}`);
    } catch (error) {
        console.error('Error fetching messages:', error);
    }

    app.innerHTML += `
        <div class="container mt-5">
            <h1 class="text-center">Chat</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="success" class="alert alert-success d-none"></div>
            <div id="message-list" class="mt-3" style="height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;"></div>
            <form id="message-form" class="mt-3">
                <div class="input-group">
                    <input type="text" id="message-input" class="form-control" placeholder="Type a message..." required>
                    <button type="submit" class="btn btn-primary">Send</button>
                </div>
            </form>
        </div>
    `;

    const messageList = document.getElementById('message-list');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    // Display initial messages
    messages.forEach(msg => {
        messageList.innerHTML += `<p><strong>${msg.sender.id === userId ? 'You' : 'Seller'}:</strong> ${msg.content} <small>${new Date(msg.timestamp).toLocaleTimeString()}</small></p>`;
    });

    // WebSocket connection
    const chatSocket = new WebSocket(`ws://localhost:8000/ws/chat/${transactionId}/`);

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        if (data.type === 'close') {
            successDiv.classList.remove('d-none');
            successDiv.textContent = `Chat closed: ${data.reason}`;
            errorDiv.classList.add('d-none');
            chatSocket.close();
        } else {
            messageList.innerHTML += `<p><strong>${data.sender_id === userId.toString() ? 'You' : 'Seller'}:</strong> ${data.message} <small>${data.timestamp}</small></p>`;
            messageList.scrollTop = messageList.scrollHeight;
        }
    };

    chatSocket.onclose = function(e) {
        console.log('Chat socket closed unexpectedly');
    };

    chatSocket.onerror = function(error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = `Error: ${error.message}`;
        successDiv.classList.add('d-none');
    };

    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const content = document.getElementById('message-input').value;
        if (content) {
            chatSocket.send(JSON.stringify({
                content: content,
                sender_id: userId
            }));
            document.getElementById('message-input').value = '';
        }
    });
};
