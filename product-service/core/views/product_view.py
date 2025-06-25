from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.serializers.product_serializer import ProductSerializer
from core.services.product_service import ProductService
from django.http import Http404
from core.middleware.auth_middleware import verify_token

class ProductListCreateView(APIView):
    def get(self, request):
        products = ProductService.list_products()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not verify_token(request):
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = ProductService.create_product(serializer.validated_data)
            return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    def get(self, request, pk):
        product = ProductService.get_product(pk)
        return Response(ProductSerializer(product).data)

    def put(self, request, pk):
        if not verify_token(request):
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        product = ProductService.update_product(pk, request.data)
        return Response(ProductSerializer(product).data)

    def delete(self, request, pk):
        if not verify_token(request):
            return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
        ProductService.delete_product(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
