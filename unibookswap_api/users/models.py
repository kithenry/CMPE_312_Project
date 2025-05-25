from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid 
# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        username = username or f'user_{email.split("@")[0]}_{uuid.uuid4().hex[:8]}'
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self, email, username, password=None, **extrafields):
        extra_fields.setdefault('trust_score',0)
        extra_fields.setdefault('transaction_count',0)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, username, password, **extra_fields)



class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, null=True) # added username field 
    password = models.CharField(max_length=255)
    trust_score = models.IntegerField(default=0)
    transaction_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login = models.DateTimeField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', default='profile_pics/default.png', blank=True, null=True)
    objects = UserManager()

    USERNAME_FIELD = 'email';
    REQUIRED_FIELDS = [] 

    def __str__(self):
        return str(self.id)

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property 
    def is_anonymous(self):
        return False

    @property 
    def is_authenticated(self): 
        return True

