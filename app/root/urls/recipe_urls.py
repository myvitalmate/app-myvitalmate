from django.urls import path

from ..views.recipe.recipe_view import RecipeSearchView, RecipeInstructionView, RecipeIngredientsView

urlpatterns = [
    path('search/', RecipeSearchView.as_view(), name='recipe-search'),
    path('search/instructions/', RecipeInstructionView.as_view(), name='recipe-search-instruction'),
    path('search/ingredients/', RecipeIngredientsView.as_view(), name='recipe-search-ingredients')
]
