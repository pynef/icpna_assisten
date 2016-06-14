from main.models import Person
import jwt
from django.conf import settings
import json


def datos_user(request):
    try:
        person = Person.objects.get(username=request.user.username)
        payload = {}
        secret_text = settings.SECRET_KEY_ERPICPNA
        permisos = person.USER_PERMISSIONS
        token = jwt.encode(payload, secret_text, algorithm='HS256')
        return {'usuario': person, 'permisos': permisos, 'key_abi': token}
    except:
        return {'usuario': [], 'key_abin': ''}
