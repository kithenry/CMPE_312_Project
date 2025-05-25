# unibookswap/ratings/serializers.py (create this file)
from rest_framework import serializers
from .models import Rating

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id', 'seller', 'rater', 'score', 'comment', 'created_at']
        read_only_fields = ['id', 'rater', 'created_at']
