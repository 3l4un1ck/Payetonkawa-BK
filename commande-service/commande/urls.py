from django.urls import path

from .views import ProductDetailView, ProductListCreateView

urlpatterns = [
    path('api/products/<int:pk>/', ProductDetailView.as_view(), name='commande-detail'),
    path('api/products/', ProductListCreateView.as_view(), name='commande-list-create'),
]