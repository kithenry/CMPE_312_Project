# permissions.py
from rest_framework.permissions import BasePermission

class IsAuthenticatedOrRegister(BasePermission):
    def has_permission(self, request, view):
        # Allow access if it's a registration request
        if request.method == 'POST' and view.__class__.__name__ == 'RegisterView':
            return True
        # Otherwise, require authentication
        return request.user and request.user.is_authenticated

