# unibookswap/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User


# unibookswap/views.py
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class CustomLogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            access_token = request.headers.get('Authorization', '').replace('Bearer ', '')

            # Blacklist refresh token
            if refresh_token:
                refresh = RefreshToken(refresh_token)
                refresh.blacklist()

            # Blacklist access token (if supported)
            if access_token:
                access = AccessToken(access_token)
                access.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined.isoformat()
        }
        return Response(data)

    def patch(self, request):
        user = request.user
        first_name = request.data.get('first_name', user.first_name)
        last_name = request.data.get('last_name', user.last_name)

        user.first_name = first_name
        user.last_name = last_name
        user.save()

        data = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'date_joined': user.date_joined.isoformat()
        }
        return Response(data)
