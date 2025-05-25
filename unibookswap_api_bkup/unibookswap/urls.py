"""
URL configuration for unibookswap project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include 
from books.views import BookViewSet
from chat.views import MessageViewSet
from transactions.views import TransactionViewSet
from users.views import UserViewSet
from rest_framework.routers import DefaultRouter
from dj_rest_auth.registration.views import RegisterView
from rest_framework.permissions import AllowAny
from .views import CustomLogoutView
from .views import UserMeView
from users.views import CustomRegisterView
from django.conf import settings
from django.conf.urls.static import static
from ratings.views import RatingViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'chat', MessageViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'user',UserViewSet)
router.register(r'ratings', RatingViewSet, basename='rating')

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')), # login
    # path('api/auth/registration/',include('dj_rest_auth.registration.urls')), # user registration
    path('api/auth/registration/', RegisterView.as_view(permission_classes=[AllowAny]), name='register'),
    path('api/auth/registration/', CustomRegisterView.as_view(), name='custom_register'),
    path('api/auth/logout',CustomLogoutView.as_view(), name='logout'),
    path('api/users/me/', UserMeView.as_view(), name='user-me'),
    path('api/', include(router.urls)),
    path('accounts/', include('allauth.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
