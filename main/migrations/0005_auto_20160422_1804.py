# -*- coding: utf-8 -*-
# Generated by Django 1.9.5 on 2016-04-22 23:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20160409_1909'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='USER_ID_INSTITUCION',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='person',
            name='USER_ID_SEDE',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]