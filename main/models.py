# main_module

from __future__ import unicode_literals

from django.db import models

from django.contrib.auth.models import User, UserManager

class Person(User):
	name = models.CharField(max_length = 256, verbose_name = "Full Name", help_text = "Full Name", null = False, blank = True)
	
	USER_ID_ERPICPNA = models.IntegerField(null=True, blank=True)
	USER_ID_INSTITUCION = models.IntegerField(null=True, blank=True)
	USER_ID_SEDE = models.IntegerField(null=True, blank=True)
	USER_FIRST_NAME = models.CharField(max_length = 256, verbose_name = "USER_FIRST_NAME", help_text="USER_FIRST_NAME", null=True, blank=True)
	USER_LAST_NAME = models.CharField(max_length = 256, verbose_name = "USER_LAST_NAME", help_text="USER_LAST_NAME", null=True, blank=True)
	USER_URL_IMG_LINK = models.CharField(max_length = 256, verbose_name = "USER_URL_IMG_LINK", help_text="USER_URL_IMG_LINK", null=True, blank=True)
	USER_PERMISSIONS = models.TextField(verbose_name = "USER_PERMISSIONS", help_text="USER_PERMISSIONS", null=True, blank=True)

	objects = UserManager()

	def __unicode__(self):
		return self.name
