from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path('recipes/<int:recipe_id>/instructions/', views.recipe_instructions, name='recipe_instructions'),
]
