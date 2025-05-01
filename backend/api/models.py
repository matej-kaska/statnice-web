from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from .managers import CustomUserManager
from django.conf import settings

class User(AbstractUser):
  ROLE_CHOICES = (
    ('user', 'User'),
    ('analytic', 'Analytic'),
    ('admin', 'Admin'),
  )

  email = models.EmailField(unique=True)
  role = models.CharField(max_length=8, choices=ROLE_CHOICES, default='user')
  first_name = models.CharField(max_length=100)
  last_name = models.CharField(max_length=100)

  username = None

  USERNAME_FIELD = "email"
  REQUIRED_FIELDS = []

  objects = CustomUserManager()

  groups = models.ManyToManyField(
    Group,
    verbose_name='groups',
    blank=True,
    help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
    related_name="custom_user_set",
    related_query_name="user",
  )
  user_permissions = models.ManyToManyField(
    Permission,
    verbose_name='user permissions',
    blank=True,
    help_text='Specific permissions for this user.',
    related_name="custom_user_set",
    related_query_name="user",
  )

  def __str__(self):
    return self.email
  
  def __repr__(self):
    return f"<User [{self.pk}] {self.email}>"

class Product(models.Model):
  name = models.CharField(max_length=255)
  description = models.TextField(blank=True)
  price = models.DecimalField(max_digits=10, decimal_places=2)
  quantity = models.PositiveIntegerField(default=0)
  low_stock_threshold = models.PositiveIntegerField(default=10)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.name

  def __repr__(self):
    return f"<Product [{self.pk}] {self.name!r}>"

  def is_low(self):
    return self.quantity <= self.low_stock_threshold


class Order(models.Model):
  STATUS_PENDING = 'pending'
  STATUS_PROCESSING = 'processing'
  STATUS_SHIPPED = 'shipped'
  STATUS_DELIVERED = 'delivered'
  STATUS_CANCELED = 'canceled'

  STATUS_CHOICES = (
    (STATUS_PENDING, 'Pending'),
    (STATUS_PROCESSING, 'Processing'),
    (STATUS_SHIPPED, 'Shipped'),
    (STATUS_DELIVERED, 'Delivered'),
    (STATUS_CANCELED, 'Canceled'),
  )

  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    related_name='orders'
  )
  status = models.CharField(
    max_length=10,
    choices=STATUS_CHOICES,
    default=STATUS_PENDING
  )
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"Objednávka #{self.pk} ({self.get_status_display()})"

  def __repr__(self):
    return f"<Order [{self.pk}] status={self.status!r}>"

class OrderItem(models.Model):
  order = models.ForeignKey(
    Order,
    on_delete=models.CASCADE,
    related_name='items'
  )
  product = models.ForeignKey(
    Product,
    on_delete=models.SET_NULL,
    null=True,
    related_name='order_items'
  )
  quantity = models.PositiveIntegerField()
  price = models.DecimalField(max_digits=10, decimal_places=2)

  def __str__(self):
    if self.product:
      return f"{self.quantity}× {self.product.name}"
    return f"Item {self.pk} (produkt smazán)"

  def __repr__(self):
    prod = self.product.name if self.product else 'None'
    return f"<OrderItem [{self.pk}] {self.quantity}× {prod!r}>"

  def get_cost(self):
    return self.quantity * self.price

class Cart(models.Model):
  user = models.OneToOneField(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='cart'
  )

  def __str__(self):
    return f"Cart({self.user.email})"
  
  def __repr__(self):
    return f"<Cart [{self.pk}] {self.user.email}>"


class CartItem(models.Model):
  cart = models.ForeignKey(
    Cart,
    on_delete=models.CASCADE,
    related_name='items'
  )
  product = models.ForeignKey(
    'Product',
    on_delete=models.CASCADE
  )
  quantity = models.PositiveIntegerField()

  class Meta:
    unique_together = ('cart', 'product')

  def __str__(self):
    return f"{self.product.name} × {self.quantity}"
  
  def __repr__(self):
    return f"<CartItem [{self.pk}] [{self.product.id}]>"