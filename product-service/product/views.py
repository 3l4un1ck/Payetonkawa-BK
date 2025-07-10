from rest_framework.views import APIView
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import ProductSerializer
from .models import Product
from .permissions import IsAuthenticatedViaRabbitMQ

from django.http import Http404
from .auth_middleware import verify_token

class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [IsAuthenticatedViaRabbitMQ]

class ProductListView(generics.ListCreateAPIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
