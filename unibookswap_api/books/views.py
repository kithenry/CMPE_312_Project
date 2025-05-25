from django.shortcuts import render
from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from rest_framework.filters import SearchFilter 
from django.db.models import Q
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction

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
        print(serializer.validated_data)
        serializer.save()
    
    def partial_update(self, request, *args, **kwargs):
        book = self.get_object()
        if book.user != request.user:
            raise PermissionDenied("You can only edit your own books.")

        # Extract data from FormData
        title = request.data.get('title', book.title)
        isbn = request.data.get('isbn', book.isbn)
        course = request.data.get('course', book.course)
        price = request.data.get('price', book.price)
        exchange_option = request.data.get('exchange_option', book.exchange_option)
        quantity = request.data.get('quantity', book.quantity)

        # Handle file upload
        cover_image = request.FILES.get('cover_image') if 'cover_image' in request.FILES else None


        # Use explicit transaction to ensure commit
        try:
            with transaction.atomic():
                serializer = self.get_serializer(book, data={
                    'title': title,
                    'isbn': isbn,
                    'course': course,
                    'price': price,
                    'exchange_option': exchange_option,
                    'quantity': quantity
                }, partial=True)
                serializer.is_valid(raise_exception=True)
                if cover_image:
                    book.cover_image = cover_image
                serializer.save()

                # Verify database state immediately after save
                updated_book = Book.objects.get(id=book.id)
                print(updated_book)

        except Exception as e:
            logger.error(f"Error during update: {str(e)}")
            raise

        return Response(serializer.data, status=status.HTTP_200_OK)


    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You can only delete your own books.")

        instance.delete()




