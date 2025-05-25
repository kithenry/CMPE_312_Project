// src/js/pages/chat.js
import { apiRequest, isAuthenticated } from '../api/auth.js';

export default async (app) => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    // Placeholder transaction ID (replace with dynamic selection later)
    const transactionId = 1; // Example; should come from transaction details

    app.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand" href="/">Unibookswap</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/transactions">Transactions</a></li>
                        <li class="nav-item"><a class="nav-link" href="/chat">Chat</a></li>
                        <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-5" style="max-width: 600px;">
            <h1 class="text-center">Chat for Transaction #${transactionId}</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="chat-messages" class="border p-3 mb-3" style="height: 400px; overflow-y: auto;"></div>
            <form id="chat-form">
                <div class="input-group">
                    <input type="text" class="form-control" id="message-input" placeholder="Type a message..." required>
                    <button type="submit" class="btn btn-primary">Send</button>
                </div>
            </form>
        </div>
    `;

    const errorDiv = document.getElementById('error');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');

    const loadMessages = async () => {
        try {
            const messages = await apiRequest(`http://localhost:8000/api/chat/${transactionId}/`);
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                chatMessages.innerHTML += `
                    <p><strong>${msg.sender || 'User'}:</strong> ${msg.content} <small>(${new Date(msg.timestamp).toLocaleTimeString()})</small></p>
                `;
            });
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest
        } catch (error) {
            errorDiv.classList.remove('d-none');
            errorDiv.textContent = 'Error loading messages: ' + error.message;
        }
    };

    const sendMessage = async (content) => {
        try {
            await apiRequest(`http://localhost:8000/api/chat/${transactionId}/`, {
                method: 'POST',
                body: JSON.stringify({ content })
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
