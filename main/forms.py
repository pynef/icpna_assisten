# main_module
from django import forms
from django.conf import settings
from django.contrib.auth.models import User
from .models import Person
import requests
import json
import jwt
import base64

from .models import Person

class LoginForm(forms.Form):
	username = forms.CharField(
			max_length = 50,
			widget = forms.TextInput(
					attrs = {
						"type" :"text",
						"placeholder" : "Usuario",
						"class" : ""
					}
				)
		)
	password = forms.CharField(
			widget = forms.TextInput(
					attrs = {
						"type" : "password",
						"placeholder" : "Contrasena",
						"class" : ""
					}
				)
		)

	def clean(self):

		cleaned_data = super(LoginForm, self).clean()

		username = cleaned_data.get("username")
		password = cleaned_data.get("password")

		if(username != None and password != None):

			# url_server = "http://localhost:57395"
		
			url_request = settings.URL_SERVER + settings.URL_SERVER_LOGIN

			payload = {
				"UserName":username,
				"Password":password,
			}
			secret_text = settings.SECRET_KEY_ERPICPNA
			encoded = jwt.encode(payload, secret_text, algorithm='HS256')
			
			try:
				print "test 0"
				request = requests.post(url_request, data=payload,  headers={'Authorization': encoded})
				print request.text
				if request.status_code == 200:
					data = json.loads(request.text)

					# COMPROBACION CON ERP EDUCATIVO si es OK
					if data['USER_STATUS']:
						get_username = User.objects.filter(username = username)
						username_exists = get_username.exists()
						print "test 1"
						if not username_exists:
							print "test 2"
							person = Person()
							person.username = username
							person.name = username
							person.USER_ID_ERPICPNA = data['USER_ID_ERPICPNA']
							person.USER_ID_INSTITUCION = data['USER_ID_INSTITUCION']
							person.USER_ID_SEDE = data['USER_ID_SEDE']
							person.USER_FIRST_NAME = data['USER_FIRST_NAME']
							person.USER_LAST_NAME = data['USER_LAST_NAME']
							person.USER_URL_IMG_LINK = settings.URL_SERVER+str(data['USER_URL_IMG_LINK'])+"_small.png"
							person.USER_PERMISSIONS = data['USER_PERMISSIONS']
							person.password = password
							person.is_active = True
							person.save()
							if person.pk:
								print "test 3"
								user = User.objects.get(pk = person.pk)
								user.set_password(password)
								user.save()
						else:
							print "test 4"
							person = Person.objects.get(pk = get_username[0].pk)
							person.username = username
							person.name = username
							person.USER_ID_ERPICPNA = data['USER_ID_ERPICPNA']
							person.USER_ID_INSTITUCION = data['USER_ID_INSTITUCION']
							person.USER_ID_SEDE = data['USER_ID_SEDE']
							person.USER_FIRST_NAME = data['USER_FIRST_NAME']
							person.USER_LAST_NAME = data['USER_LAST_NAME']
							person.USER_URL_IMG_LINK = settings.URL_SERVER+str(data['USER_URL_IMG_LINK'])+"_small.png"
							person.USER_PERMISSIONS = data['USER_PERMISSIONS']
							person.save()
										
					else:
						self.add_error("username","Los datos con ERP - EDUCATIVO no coinciden.")			
				else:
					return self.add_error("username","Peticion invalida ERP - EDUCATIVO API ")
					
			except Exception as e:
				print "-"*50
				print e
				print "-"*50
				return self.add_error("username","No existe conexion con ERP - EDUCATIVO")