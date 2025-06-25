from core.models.product import Product
from django.shortcuts import get_object_or_404

class ProductService:
    @staticmethod
    def create_product(data):
        return Product.objects.create(**data)

    @staticmethod
    def list_products():
        return Product.objects.all()

    @staticmethod
    def get_product(pk):
        return get_object_or_404(Product, pk=pk)

    @staticmethod
    def update_product(pk, data):
        product = get_object_or_404(Product, pk=pk)
        for attr, value in data.items():
            setattr(product, attr, value)
        product.save()
        return product

    @staticmethod
    def delete_product(pk):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
