from rest_framework import serializers
from ..models import Product, Order, OrderItem, Cart, CartItem, User

class ProductSerializer(serializers.ModelSerializer):
  is_low = serializers.SerializerMethodField()

  class Meta:
    model = Product
    fields = [
      'id', 'name', 'description', 'price', 'quantity', 'is_low', 'low_stock_threshold'
    ]

  def get_is_low(self, obj):
    return obj.quantity <= obj.low_stock_threshold


class OrderItemSerializer(serializers.ModelSerializer):
  product = ProductSerializer(read_only=True)
  product_id = serializers.PrimaryKeyRelatedField(
    queryset=Product.objects.all(),
    source='product',
    write_only=True
  )

  class Meta:
    model = OrderItem
    fields = ['product', 'product_id', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
  user = serializers.StringRelatedField()
  items = OrderItemSerializer(
    many=True,
    read_only=True
  )
  full_price = serializers.SerializerMethodField()

  class Meta:
    model = Order
    fields = [
      'id', 'user', 'status', 'updated_at',
      'created_at', 'items', 'full_price'
    ]

  def get_full_price(self, obj):
    return sum(item.quantity * item.price for item in obj.items.all())

class OrderUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ["email", "first_name", "last_name"]

class OrderFullSerializer(serializers.ModelSerializer):
  user = OrderUserSerializer(read_only=True)
  items = OrderItemSerializer(
    many=True,
    read_only=True
  )
  full_price = serializers.SerializerMethodField()

  class Meta:
    model = Order
    fields = [
      'id', 'user', 'status', 'updated_at',
      'created_at', 'items', 'full_price'
    ]

  def get_full_price(self, obj):
    return sum(item.quantity * item.price for item in obj.items.all())

class CartItemSerializer(serializers.ModelSerializer):
  product_id = serializers.PrimaryKeyRelatedField(
    queryset=Product.objects.all(),
    source='product',
    write_only=True
  )
  product = serializers.StringRelatedField(read_only=True)

  class Meta:
    model = CartItem
    fields = ['product', 'product_id', 'quantity']

class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True, read_only=True)

  class Meta:
    model = Cart
    fields = ['id', 'items']

class CartFullItemSerializer(serializers.ModelSerializer):
  id = serializers.IntegerField(source='product.id', read_only=True)
  name = serializers.CharField(source='product.name', read_only=True)
  price = serializers.DecimalField(
    source='product.price',
    max_digits=10,
    decimal_places=2,
    read_only=True
  )
  quantity = serializers.IntegerField(read_only=True)

  class Meta:
    model = CartItem
    fields = ['id', 'name', 'quantity', 'price']

class CartFullSerializer(serializers.ModelSerializer):
  items = CartFullItemSerializer(many=True, read_only=True)
  full_price = serializers.SerializerMethodField()

  class Meta:
    model = Cart
    fields = ['items', 'full_price']

  def get_full_price(self, obj: Cart) -> float:
    return sum(
      item.quantity * item.product.price
      for item in obj.items.all()
    )
