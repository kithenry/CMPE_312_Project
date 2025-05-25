# unibookswap/books/models.py
from django.db import models
from users.models import User

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True)
    course = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    exchange_option = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('sold', 'Sold Out')
        ],
        default='available'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='books')
    cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # to fix the double save issue
        is_new = self._state.adding
        print('Is book new? (True / False)', is_new)
        if is_new:
            self.status = 'available' if self.quantity > 0 else 'sold'
            print('saving with status',self.status)
            super().save(*args, **kwargs) # interesting age case here
            return
        else:
            kwargs['force_insert'] = False
            kwargs['force_update'] = True

        # if int(self.quantity) > 0 and not self.transactions.filter(status='pending').exists(): ( a book with a pending trans can still have more than a copy available
        if int(self.quantity) > 0 :
            self.status = 'available' 
            print('available status, ',self.status)
        #elif self.transactions.filter(status='pending').exists():
         #   self.status = 'pending'
        else:
            print('else, self.status: ', self.status)
            self.status = 'sold'
        #print('This is self.status',self.status) 
        #if self.status != new_status:
        #   self.status = new_status
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
