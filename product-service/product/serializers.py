from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        try:
            if int(attrs.get('prix')) < 0:
                raise serializers.ValidationError("Price cannot be negative.")
        except ValueError:
            raise serializers.ValidationError("Price must be a number.")
        return attrs

    def create(self, validated_data):
        return Product.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance