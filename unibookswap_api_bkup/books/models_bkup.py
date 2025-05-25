from django.db import models
from users.models import User

# Create your models here.

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    isbn = models.CharField(max_length=13)
    course = models.CharField(max_length=50, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    exchange_option = models.BooleanField(default=False)
    status = models.CharField(max_length=20)
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [models.Index(fields=['isbn'])]
