from django.db import models
from books.models import Book 
from users.models import User 

# Create your models here.
class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    buyer = models.ForeignKey(User, related_name='buyer', on_delete=models.CASCADE)
    seller = models.ForeignKey(User, related_name='seller', on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    type = models.CharField(max_length=20)
    status = models.CharField(max_length=20)
    rating = models.IntegerField(null=True)
    feedback = models.CharField(max_length=500, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)
