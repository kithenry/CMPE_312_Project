# unibookswap/chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
# from django.contrib.auth import get_user_model
from users.models import User
from .models import Message
from transactions.models import Transaction

# User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.transaction_id = self.scope['url_route']['kwargs']['transaction_id']
        self.group_name = f'chat_{self.transaction_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['content']
        sender_id = data['sender_id']
        transaction = await Transaction.objects.aget(id=self.transaction_id)
        sender = await User.objects.aget(id=sender_id)
        receiver = transaction.seller if sender == transaction.buyer else transaction.buyer

        # Save message to database
        message_obj = await Message.objects.acreate(
            transaction=transaction,
            sender=sender,
            receiver=receiver,
            content=message
        )

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'timestamp': message_obj.timestamp.isoformat()
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_id': event['sender_id'],
            'timestamp': event['timestamp']
        }))

    async def chat_close(self, event):
        await self.send(text_data=json.dumps({
            'type': 'close',
            'reason': event['reason']
        }))
        await self.close()
