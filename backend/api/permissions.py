from rest_framework import permissions

class IsUser(permissions.BasePermission):

  def has_permission(self, request, _):
    return (
      request.user 
      and request.user.is_authenticated 
      and getattr(request.user, 'role', None) == 'user'
    )


class IsAnalytic(permissions.BasePermission):

  def has_permission(self, request, _):
    return (
      request.user 
      and request.user.is_authenticated 
      and getattr(request.user, 'role', None) == 'analytic'
    )


class IsAdmin(permissions.BasePermission):

  def has_permission(self, request, _):
    return (
      request.user 
      and request.user.is_authenticated 
      and getattr(request.user, 'role', None) == 'admin'
    )
