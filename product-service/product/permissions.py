from rest_framework.permissions import BasePermission
from productservice.consumer import check_auth_token

class IsAuthenticatedViaRabbitMQ(BasePermission):
    def has_permission(self, request, view):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False
        token = auth_header.split(' ')[1]
        try:
            result = check_auth_token(token)
            return result.get('valid', False)
        except Exception:
            return False