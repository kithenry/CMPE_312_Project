# unibookswap/transactions/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        book = serializer.validated_data['book']
        if book.quantity < 1: # apply this at front end, disable buy button for sold books
            raise PermissionDenied("No copies available for this book.")
        serializer.save(buyer=self.request.user, seller=book.user)
        book.quantity -= 1
        book.save()

    def update(self, request, *args, **kwargs):
        instance  = self.get_object()
        if instance.full_confirm:
            raise PermissionDenied("Transaction already confiremd")
        if request.data.get('status') == 'canceled':
            if request.user == instance.buyer:
                instance.canceled_by = instance.buyer
            else:
                instance.canceled_by = instance.seller
            instance.book.quantity += 1
        elif request.data.get('status') == 'confirm':
            if request.user == instance.user:
                instance.buyer_confirm = True
            else:
                instance.seller_confirm = True
        if instance.seller_confirm and instance.buyer_confirm:
            instance.full_confirm = True
        instance.save()
        instance.book.save()
        return super().update(request, *args, **kwargs)

    def old_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == 'confirmed' and instance.confirmed_by:
            raise PermissionDenied("Transaction already confirmed.")
        if request.user != instance.buyer and request.user != instance.seller:
            raise PermissionDenied("You can only update your own transactions.")
        if request.data.get('status') == 'confirmed':
            if not instance.confirmed_by: # no one has confirmed yet
                # print('request user is: ', request.user)
                # print('request user is seller? ',request.user == instance.buyer)
                instance.confirmed_by = 'buyer' if request.user == instance.buyer else 'seller'
                # instance.status = 'confirmed'
            elif instance.confirmed_by != ('buyer' if request.user == instance.buyer else 'seller'): # someone has confirmed if we get to this statement
                '''
                make sure the person confirming is not the one that previously confirmed
                if the previous confirmaton (instance.confirmed_by) is not the person making the request (request.user), then its the final confirmation
                change the instance status to fully confirmed
                '''
                instance.status = 'confirmed'  # Mutual confirmation
            else: # instance.confirmed by passed (someone confirmed, but the same person tried to reconfirm... to change the final status, and thats not allowed)
                raise PermissionDenied("Both parties must confirm to change status.")
        elif request.data.get('status') == 'canceled':
            if request.user == instance.buyer or request.user == instance.seller:
                instance.status = 'canceled'
                instance.canceled_by = 'buyer' if request.user == instance.buyer else 'seller'
                instance.book.quantity += 1  # Return quantity
                instance.book.status = 'available'
            else:
                raise PermissionDenied("Only buyer or seller can cancel.") # this is ambiguous and useless
        else:
            raise PermissionDenied("Invalid status update.")
        instance.save()
        instance.book.save() # save function depends on saved data from transaction.. so save transaction first
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            # print('returning results here')
            # print(Transaction.objects.all())
            # print(str(self.request.user))
            result = Transaction.objects.filter(buyer=self.request.user) | Transaction.objects.filter(seller_id=self.request.user)
            # print(result)
            return Transaction.objects.filter(buyer_id=self.request.user) | Transaction.objects.filter(seller_id=self.request.user)
        return Transaction.objects.none()
