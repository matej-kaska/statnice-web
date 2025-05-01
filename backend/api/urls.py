from django.http import JsonResponse
from django.urls import path

from api.views.tests import SQLTestViewSet
from api.views.users import ObtainAuthToken, RegisterView, UserViewSet
from api.views.store import CartFullView, CartView, ProductListView, ProductDetailView, ProductCreateView, OrderListView, OrderCreateView, OrderDetailView

urlpatterns = [
  path("test/connection", lambda _: JsonResponse({"message": "Backend is connected!"})),
  path("test/sql", SQLTestViewSet.as_view()),

  path("user/token", ObtainAuthToken.as_view()),
  path("user/me", UserViewSet.as_view()),
  path("user/register", RegisterView.as_view()),

  path('products/', ProductListView.as_view(), name='product-list'),
  path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
  path('products/create/', ProductCreateView.as_view(), name='product-create'),

  path('orders/', OrderListView.as_view(), name='order-list'),
  path('orders/<int:id>/', OrderDetailView.as_view(), name='order-detail'),
  path('orders/create/', OrderCreateView.as_view(), name='order-create'),

  path('cart/', CartView.as_view(), name='cart'),
  path('cart/full/', CartFullView.as_view(), name='cart-full'),
]