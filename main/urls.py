#login_module
from django.contrib.auth.decorators import login_required

from django.conf.urls import url
from django.contrib import admin
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

from main.views import DashboardHomeView

urlpatterns = [

	url(r'^dashboard',
		DashboardHomeView.as_view(),
		name="dashboard" ),

]
