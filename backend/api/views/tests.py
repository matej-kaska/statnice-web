from django.http import JsonResponse
from rest_framework.views import APIView
from django.db import connections
from django.db.utils import OperationalError

class SQLTestViewSet(APIView):

  def get(self, _):
    try:
      db_conn = connections['default']
      db_conn.cursor()
      return JsonResponse({"message": "SQL is connected!"})
    except OperationalError:
      return JsonResponse({"message": "SQL is NOT connected!"})