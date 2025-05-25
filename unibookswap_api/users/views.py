from django.shortcuts import render
from rest_framework import viewsets
import logging
from dj_rest_auth.registration.views import RegisterView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

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

class CustomRegisterView(RegisterView):
    def get_response_data(self, user):
        # Generate JWT tokens manually
        refresh = RefreshToken.for_user(user)
        
        # Return custom response with tokens
        return {
            'user': user.id,
            'email': user.email,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }
    def perform_create(self, serializer):
        user = serializer.save(self.request)
        logger.debug(f"User {user.email} registered")
