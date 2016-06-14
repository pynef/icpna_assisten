# project

from django.conf.urls import url
from django.contrib import admin
from django.conf.urls import include
from django.views.generic import TemplateView

from main.views import LoginFormView

urlpatterns = [
    url(r'^$', LoginFormView.as_view(), name = "login_home"),
    url(r'^logout/', 'django.contrib.auth.views.logout' ,{'next_page': '/'} , name='logout'),

    url(r'^', include('main.urls')),
    url(r'^', include('configuracion.urls')),
    url(r'^', include('notas.urls')),
    url(r'^', include('asistencia.urls')),

    url(r'^admin/', admin.site.urls),
]
