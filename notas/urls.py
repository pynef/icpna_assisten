# notas_module

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required


urlpatterns = [   	
	url(r'^notas$', 
		login_required(TemplateView.as_view(template_name="notas/notas.html")), 
		name='notas'), 
]
