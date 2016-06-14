from django import template
from django.db.models.query import QuerySet

from datetime import date, timedelta

register = template.Library()

class AngularJS(template.Node):
	def __init__(self, bits):
		self.ng = bits

	def render(self, ctx):
		return "{{%s}}" % " ".join(self.ng[1:])

@register.tag(name = 'ng')
def do_angular(parser, token):
	bits = token.split_contents()
	return AngularJS(bits)