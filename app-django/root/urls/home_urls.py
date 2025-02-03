from django.urls import path

from root.views.home.home_view import HomeView

urlpatterns = [
    path('check/', HomeView.as_view(), name='health-check'),
]
