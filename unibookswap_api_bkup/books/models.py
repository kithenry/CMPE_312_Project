# unibookswap/books/models.py
from django.db import models
from users.models import User

class Book(models.Model):
    title = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True)
    course = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    exchange_option = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('sold', 'Sold'),
            ('pending', 'Pending')
        ],
        default='available'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)

    def __str__(self):
        return self.title

