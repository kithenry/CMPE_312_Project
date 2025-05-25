# unibookswap/ratings/models.py 
from django.db import models
from users.models import User

class Rating(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    score = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seller', 'rater')  # Prevent multiple ratings from same user

    def __str__(self):
        return f"Rating {self.score} by {self.rater} for {self.seller}"
