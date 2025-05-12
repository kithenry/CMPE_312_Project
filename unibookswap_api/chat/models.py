from django.db import models
from users.models import User 
from transactions.models import Transaction

# Create your models here.
class Message(models.Model):
    id = models.AutoField(primary_key=True)
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='receiver', on_delete=models.CASCADE)
    content = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
