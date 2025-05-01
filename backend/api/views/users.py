from django.forms import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.views import ObtainAuthToken as DefaultObtainAuthToken
from rest_framework.authtoken.models import Token
from api.models import User
from api.serializers.user_serializer import UserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.validators import validate_email

class ObtainAuthToken(DefaultObtainAuthToken):

  def post(self, request):
    email = request.data.get('email', '')
    password = request.data.get('password', '')

    try:
      user = User.objects.get(email=email)
    except User.DoesNotExist:
      return Response({
        "message": "Invalid credentials"
      }, status=status.HTTP_400_BAD_REQUEST)

    if not user.check_password(password):
      return Response({
        "message": "Invalid credentials"
      }, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
      "email":      user.email,
      "role":       user.role,
      "first_name": user.first_name,
      "last_name":  user.last_name,
      "token":      token.key,
    }, status=status.HTTP_200_OK)

class UserViewSet(APIView):
  permission_classes = (IsAuthenticated,)
  serializer_class = UserSerializer

  def get(self, request):
    user = request.user
    serializer = self.serializer_class(user)
    return Response(serializer.data)

class RegisterView(APIView):
  
  def post(self, request):
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    email = request.data.get('email', '')
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')

    if len(first_name) < 2:
      return Response({
        "message": "First name must be at least 2 characters long"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    if len(last_name) < 2:
      return Response({
        "message": "Last name must be at least 2 characters long"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
      validate_email(email)
    except ValidationError:
      return Response({
        "message": "Invalid e-mail"
      }, status=400)
    
    if len(password) < 8:
      return Response({
        "message": "Password must be at least 8 characters long"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    if password != confirm_password:
      return Response({
        "message": "Passwords do not match"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
      return Response({
        "message": "User with this e-mail already exists"
      }, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(
      first_name=first_name,
      last_name=last_name,
      email=email,
      password=password
    )

    token, _ = Token.objects.get_or_create(user=user)
    return Response({
      'token': token.key,
      'user': UserSerializer(user).data
    }, status=status.HTTP_201_CREATED)