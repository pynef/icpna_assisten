# -*- coding: utf-8 -*-
# main_module

from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.generic import FormView
from .forms import LoginForm
from django.core.urlresolvers import reverse_lazy
from django.contrib.auth import authenticate, login

from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from .models import Person

class LoginFormView(FormView):
    template_name = "main/login.html"
    form_class = LoginForm
    success_url = reverse_lazy("dashboard")

    def form_valid(self, form):

        user = authenticate(
            username = form.cleaned_data['username'],
            password = form.cleaned_data['password']
        )

        if user is not None:
            login(self.request, user)
            return super(LoginFormView, self).form_valid(form)


@method_decorator(login_required, name='dispatch')
class DashboardHomeView(TemplateView):
    template_name = "main/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super(DashboardHomeView, self).get_context_data(**kwargs)
        context['data_example'] = {"name":"Name Example."}
        return context
