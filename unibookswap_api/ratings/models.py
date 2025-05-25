# unibookswap/ratings/models.py
from django.db import models
from users.models import User
from transactions.models import Transaction

class Rating(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='ratings', null=True, blank=True)
    score = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seller', 'rater', 'transaction')

    def __str__(self):
        return f"Rating {self.score} by {self.rater} for {self.seller}"

    @property
    def average_rating(self):
        ratings = Rating.objects.filter(seller=self.seller)
        return ratings.aggregate(models.Avg('score'))['score__avg'] or 0
