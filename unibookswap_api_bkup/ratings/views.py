# unibookswap/ratings/views.py (create this file)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Rating
from .serializers import RatingSerializer

class RatingViewSet(viewsets.ModelViewSet):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(rater=self.request.user)

    def perform_update(self, serializer):
        rating = self.get_object()
        if rating.rater == self.request.user:
            raise PermissionDenied("You cannot edit your own ratings.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.rater != self.request.user:
            raise PermissionDenied("You cannot delete others' ratings of you.")
        instance.delete()
