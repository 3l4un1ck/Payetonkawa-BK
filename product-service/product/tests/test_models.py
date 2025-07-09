import pytest
from product.models import Product

@pytest.mark.django_db
def test_create_product():
    product = Product.objects.create(
        nom="Test Café",
        type="grain",
        categorie="Café",
        format="sachet",
        quantite=10,
        prix=5.99,
        description="Un café de test",
        image="https://www.graindecafe.com/cdn/shop/files/cafe_grain_ethiopie_djimmah.webp?v=1745797253&width=600"
    )
    assert product.id is not None
    assert product.nom == "Test Café"
    assert product.quantite == 10
    assert float(product.prix) == 5.99
