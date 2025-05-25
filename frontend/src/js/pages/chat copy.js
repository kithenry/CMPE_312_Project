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
    const otherId = params.get('receiver');

    // Placeholder transaction ID (replace with dynamic selection later)

    app.innerHTML += `
       
        <div class="container mt-5" style="max-width: 600px;">
            <h1 class="text-center">Chat for Transaction #${transactionId}</h1>
            <div id="error" class="alert alert-danger d-none"></div>
            <div id="chat-messages" class="border p-3 mb-3" style="height: 400px; overflow-y: auto;"></div>
            <form id="chat-form">
                <div class="input-group">
                    <input type="text" class="form-control" id="message-input" placeholder="Type a message..." required>
                    <button type="submit" class="btn btn-primary">Send</button>
                </div>
                <div class="col-sm-3 col-sm-offset-4 frame">
                    <ul></ul>
                    <div>
                    <div class="msj-rta macro">                        
                        <div class="text text-r" style="background:whitesmoke !important">
                        <input  id="message-input" class="mytext" placeholder="Type a message... "/>
                    </div> 

                    </div>
                    <div style="padding:10px;">
                        <span class="glyphicon glyphicon-share-alt"></span>
                        <button type="submit" class="btn btn-primary">Send</button>
                    </div>                
                    </div>
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
            const messages = await apiRequest(`http://localhost:8000/api/chat/${transactionId}/`, options={'skiAuth':true, method:'GET'});
            chatMessages.innerHTML = '';
	    console.log(messages);
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
