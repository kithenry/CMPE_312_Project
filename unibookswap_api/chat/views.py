# unibookswap/messages/views.py
from rest_framework import viewsets
from .models import Message
from .serializers import MessageSerializer
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.decorators import action
from transactions.models import Transaction


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        transaction_id = self.request.query_params.get('transaction_id')

        if self.request.user.is_authenticated:
            if transaction_id:
                queryset = queryset.filter(transaction_id=transaction_id)
            else:
                # Optionally restrict to user's transactions
                # Assuming Message has a user or transaction relation to the user
                queryset = queryset.filter(transaction__buyer=self.request.user) | queryset.filter(transaction__seller=self.request.user)
        else:
            return Message.objects.none()

        return queryset


    @action(detail=True, methods=['get', 'post'])
    def conversation(self, request, transaction_id=None):
        #try:
        #    transaction = Transaction.objects.get(id=transaction_id)
        #    if transaction.buyer != request.user and transaction.seller != request.user:
        #        return Response({"detail": "You do not have permission to access this conversation."}, status=403)
        #except Transaction.DoesNotExist:
        #    return Response({"detail": "Transaction not found."}, status=404)
        if request.method == 'GET':
            print('getting messages')
            messages = Message.objects.filter(transaction_id=transaction_id)
            serializer = self.get_serializer(messages, many=True)
            return Response(serializer.data)
    def post(self, request, transaction_id):
        print('posting messages')
        data = request.data.copy()
        print(data)
        data['transaction'] = transaction_id
        data['sender'] = request.user.id
        # Determine recipient (other party in the transaction)
        transaction = Transaction.objects.get(id=transaction_id)
        recipient = transaction.seller if request.user == transaction.buyer else transaction.buyer
        data['recipient'] = recipient.id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
