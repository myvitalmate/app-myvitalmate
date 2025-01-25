from django.urls import path

from root.views.recipe.recipe_view import RecipeSearchView

urlpatterns = [
    path('search/', RecipeSearchView.as_view(), name='recipe-search'),
]
