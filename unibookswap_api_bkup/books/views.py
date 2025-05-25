from django.shortcuts import render
from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from rest_framework.filters import SearchFilter 
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied

# Create your views here.

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [SearchFilter]
    search_fields = ['isbn','course','title']

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        # Filter based on query parameters
        user_id = self.request.query_params.get('user_id')
        status = self.request.query_params.get('status')
        user_id_ne = self.request.query_params.get('user_id__ne')
        search = self.request.query_params.get('search','').lower()

        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if status:
            queryset = queryset.filter(status=status)
        if user_id_ne:
            queryset = queryset.exclude(user_id=user_id_ne)
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(course__icontains=search))

        return queryset

    def perform_update(self, serializer):
        book = self.get_object()
        if book.user != self.request.user:
            raise PermissionDenied("You can only delete books you own.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own books.")

        instance.delete()




