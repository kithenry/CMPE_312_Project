# unibookswap/transactions/models.py
from django.db import models
from users.models import User
from books.models import Book
import uuid

class Transaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='transactions')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    type = models.CharField(max_length=20, choices=[('sale', 'Sale'), ('exchange', 'Exchange')], default='sale')
    buyer_confirm = models.BooleanField(default=False)
    seller_confirm = models.BooleanField(default=False)
    full_confirm = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    canceled_by = models.CharField(max_length=20, choices=[('buyer', 'Buyer'), ('seller', 'Seller')], null=True, blank=True) # edge case if both cancel at the same time

    def __str__(self):
        return f"Transaction {self.id} for {self.book.title}"

    class Meta:
        ordering: ['created_at']
