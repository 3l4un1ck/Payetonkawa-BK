from django.urls import path

from product.views import ProductDetailView, ProductListCreateView

urlpatterns = [
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('api/products/', ProductListCreateView.as_view(), name='product-list-create'),
]