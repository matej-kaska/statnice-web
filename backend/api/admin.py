from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Cart, CartItem, User, Product, Order, OrderItem

class CustomUserAdmin(BaseUserAdmin):
  model = User
  list_display = ['email', 'role', 'is_active', 'is_staff', 'is_superuser', 'get_groups']
  list_filter = ['role', 'is_active', 'is_staff', 'is_superuser', 'groups']
  fieldsets = (
    (None, {'fields': ('email', 'password', 'role', 'first_name', 'last_name')}),
    ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    ('Important dates', {'fields': ('last_login', 'date_joined')}),
  )
  add_fieldsets = (
    (None, {
      'classes': ('wide',),
      'fields': (
        'email', 'password1', 'password2', 'role', 'first_name', 'last_name',
        'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
      )
    }),
  )
  search_fields = ('email',)
  ordering = ('email',)

  def get_groups(self, obj):
    return ", ".join([g.name for g in obj.groups.all()])
  get_groups.short_description = 'Groups'


class ProductAdmin(admin.ModelAdmin):
  list_display = ['name', 'quantity', 'low_stock_threshold', 'price', 'created_at', 'updated_at']
  list_filter = ['low_stock_threshold']
  search_fields = ['name']


class OrderItemInline(admin.TabularInline):
  model = OrderItem
  extra = 0
  readonly_fields = ['product', 'quantity', 'price']


class OrderAdmin(admin.ModelAdmin):
  list_display = ['pk', 'user', 'status', 'created_at', 'updated_at']
  list_filter = ['status']
  search_fields = ['user__email']
  inlines = [OrderItemInline]

admin.site.register(User, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OrderItem)

