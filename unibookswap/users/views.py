from django.shortcuts import render
from rest_framework import viewsets

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from .serializers import UserSerializer
from .models import User

# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer



class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email, password=password).first()
        if User:
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER 
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER 
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            return Response({'token': token})
        return Response({'error':'Invalid credentials'}, status=401)


