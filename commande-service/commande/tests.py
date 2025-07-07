from django.test import TestCase
from .models import Product


class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            price=100.0,
            stock=50
        )

    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test Product")
        self.assertEqual(self.product.price, 100.0)
        self.assertEqual(self.product.stock, 50)

    def test_product_str(self):
        self.assertEqual(str(self.product), "Test Product")

    def test_product_price_negative(self):
        with (self
                      .assertRaises(ValueError)):
            Product.objects.create(name="Invalid Product", price=-10.0, stock=10)