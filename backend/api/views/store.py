from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Cart, CartItem, OrderItem, Product, Order
from ..serializers.store_serializer import (
  CartFullSerializer,
  CartSerializer,
  OrderFullSerializer,
  ProductSerializer,
  OrderSerializer,
)
from ..permissions import (
  IsAnalytic,
  IsAdmin,
  IsUser,
)
from ..pagination import StandardPagination


class ProductListView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def get(self, request):
    qs = Product.objects.all()
    order = request.query_params.get('order', 'name')
    allowed = ['name', '-name', 'quantity', '-quantity', 'price', '-price']
    if order in allowed:
      qs = qs.order_by(order)
    paginator = StandardPagination()
    page = paginator.paginate_queryset(qs, request)
    serializer = ProductSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)


class ProductDetailView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def get(self, _, id):
    prod = get_object_or_404(Product, pk=id)
    serializer = ProductSerializer(prod)
    return Response(serializer.data)
  
  def delete(self, request, id):
    if not request.user.role == 'admin':
      return Response({"message": "You do not have permission to delete this product."}, status=status.HTTP_403_FORBIDDEN)
    prod = get_object_or_404(Product, pk=id)
    prod.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

  def patch(self, request, id):
    if not request.user.role == 'admin':
      return Response({"message": "You do not have permission to update this product."}, status=status.HTTP_403_FORBIDDEN)
    prod = get_object_or_404(Product, pk=id)
    serializer = ProductSerializer(prod, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_200_OK)
    return Response({"message": "Data are not in valid format"}, status=status.HTTP_400_BAD_REQUEST)

class ProductCreateView(APIView):
  permission_classes = [IsAdmin]

  def post(self, request):
    name = request.data.get('name', '')
    description = request.data.get('description', '')
    price = request.data.get('price', 0)
    quantity = request.data.get('quantity', 0)
    low_stock_threshold = request.data.get('low_stock_threshold', 0)

    if len(name) < 2:
      return Response({"message": "Name must be at least 2 characters long"}, status=status.HTTP_400_BAD_REQUEST)
    if len(description) < 2:
      return Response({"message": "Description must be at least 2 characters long"}, status=status.HTTP_400_BAD_REQUEST)
    
    product = Product.objects.create(
      name=name,
      description=description,
      price=price,
      quantity=quantity,
      low_stock_threshold=low_stock_threshold
    )

    return Response({"id": product.id}, status=status.HTTP_201_CREATED)

class OrderListView(APIView):
  permission_classes = [IsAnalytic | IsAdmin | IsUser]

  def get(self, request):
    if request.user.role == 'user':
      qs = Order.objects.filter(user=request.user)
    else:
      qs = Order.objects.all()
    order = request.query_params.get('order', 'created_at')
    allowed = ['created_at', '-created_at', 'updated_at', '-updated_at']
    if order in allowed:
      qs = qs.order_by(order)
    paginator = StandardPagination()
    page = paginator.paginate_queryset(qs, request)
    serializer = OrderSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

class OrderDetailView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def get(self, request, id):
    order = get_object_or_404(Order, pk=id)

    if not (
      request.user == order.user or 
      request.user.role in ("analytic", "admin")
    ):
      return Response(
        {"detail": "You do not have permission to view this order."},
        status=status.HTTP_403_FORBIDDEN
      )

    serializer = OrderFullSerializer(order)
    return Response(serializer.data, status=status.HTTP_200_OK)

  def patch(self, request, id):
    if not request.user.role == 'admin':
      return Response({"message": "You do not have permission to update this order."}, status=status.HTTP_403_FORBIDDEN)
    new_status = request.data.get('status')
    if new_status not in ['pending', 'shipped', 'delivered', 'cancelled']:
      return Response({"message": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    order = get_object_or_404(Order, pk=id)
    if order.user != request.user and not request.user.role == 'admin':
      return Response({"message": "You do not have permission to update this order."}, status=status.HTTP_403_FORBIDDEN)
    
    order.status = new_status
    order.save()
    
    return Response({"message": "Order updated"}, status=status.HTTP_200_OK)
  
  def delete(self, request, id):
    """
      Not implemented yet
    """
    return Response({"message": "Deleting orders is not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    order = get_object_or_404(Order, pk=id)
    if order.user != request.user and not request.user.is_admin:
      return Response({"message": "You do not have permission to delete this order."}, status=status.HTTP_403_FORBIDDEN)
    order.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

class OrderCreateView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def post(self, request):
    if not request.data:
      return Response({"message": "No data provided"}, status=status.HTTP_400_BAD_REQUEST)
    if not isinstance(request.data, dict):
      return Response(
        {"message": "Invalid payload, expected an object of id→quantity pairs"},
        status=status.HTTP_400_BAD_REQUEST
      )
    if len(request.data) == 0:
      return Response({"message": "No products provided"}, status=status.HTTP_400_BAD_REQUEST)
    for key, val in request.data.items():
      try:
        pid = int(key)
        qty = int(val)
      except (ValueError, TypeError):
        return Response({"message": "Invalid key or quantity"}, status=status.HTTP_400_BAD_REQUEST)

      try:
        product = Product.objects.get(pk=pid)
      except Product.DoesNotExist:
        return Response({"message": f"Product {pid} does not exist"}, status=status.HTTP_400_BAD_REQUEST)

      if qty > product.quantity:
        return Response({"message": f"Requested quantity ({qty}) exceeds available stock ({product.quantity})"}, status=status.HTTP_400_BAD_REQUEST)

    order = Order.objects.create(user=request.user)
    for pid, qty in request.data.items():
      try:
        product = Product.objects.get(pk=pid)
      except Product.DoesNotExist:
        continue

      if qty > 0:
        OrderItem.objects.create(
          order=order,
          product=product,
          quantity=qty,
          price=product.price
        )
        product.quantity -= qty
        product.save()
    
    return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class CartView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def get(self, request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

  def patch(self, request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    data = request.data

    if not isinstance(data, dict):
      return Response(
        {"message": "Invalid payload, expected an object of id→quantity pairs"},
        status=status.HTTP_400_BAD_REQUEST
      )

    items_map: dict[int,int] = {}
    for key, val in data.items():
      try:
        pid = int(key)
        qty = int(val)
      except (ValueError, TypeError):
        continue
      items_map[pid] = qty
    errors: dict[str,str] = {}
    for pid, qty in items_map.items():
      if qty <= 0:
        continue
      try:
        product = Product.objects.get(pk=pid)
      except Product.DoesNotExist:
        return Response({"message": f"Product {pid} does not exist"}, status=status.HTTP_400_BAD_REQUEST)

      if qty > product.quantity:
        return Response({"message": f"Requested quantity ({qty}) exceeds available stock ({product.quantity})"}, status=status.HTTP_400_BAD_REQUEST)


    if errors:
      return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    CartItem.objects.filter(cart=cart).exclude(product_id__in=items_map.keys()).delete()

    for pid, qty in items_map.items():
      try:
        product = Product.objects.get(pk=pid)
      except Product.DoesNotExist:
        continue

      if qty > 0:
        CartItem.objects.update_or_create(
          cart=cart,
          product=product,
          defaults={"quantity": qty}
        )
      else:
        CartItem.objects.filter(cart=cart, product=product).delete()

    serializer = CartSerializer(cart)
    return Response(serializer.data, status=status.HTTP_200_OK)

class CartFullView(APIView):
  permission_classes = [IsUser | IsAnalytic | IsAdmin]

  def get(self, request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    serializer = CartFullSerializer(cart)
    return Response(serializer.data)