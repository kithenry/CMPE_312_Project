from django.shortcuts import render
from rest_framework import viewsets 
from .models import Message
from .serializers import MessageSerializer


# Create your views here.

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer 
