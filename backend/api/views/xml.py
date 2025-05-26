import os
from django.conf import settings
from django.http import HttpResponse
import xml.etree.ElementTree as ET
from ..models import Product
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
import xmlschema
from xmlschema.validators.exceptions import XMLSchemaValidationError

XSD_PATH = os.path.join(settings.BASE_DIR, 'xsd', 'products.xsd')
schema = xmlschema.XMLSchema(XSD_PATH)

class XMLView(APIView):

  def get(self, request):
    
    root = ET.Element('products')

    for prod in Product.objects.all():
      prod_elem = ET.SubElement(root, 'product', id=str(prod.pk))

      name = ET.SubElement(prod_elem, 'name')
      name.text = prod.name

      desc = ET.SubElement(prod_elem, 'description')
      desc.text = prod.description or ''

      price = ET.SubElement(prod_elem, 'price')
      price.text = str(prod.price)

    xml_bytes = ET.tostring(root, encoding='utf-8', xml_declaration=True)

    try:
      schema.validate(xml_bytes)
      print("XML is valid against the schema.")
    except XMLSchemaValidationError as err:
      return Response(
        {
          "detail": "Generated XML failed XSD validation",
          "errors": str(err)
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )

    return HttpResponse(xml_bytes, content_type='application/xml')
