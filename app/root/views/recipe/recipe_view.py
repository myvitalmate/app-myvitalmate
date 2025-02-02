from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView
from ...services.recipes_search import get_recipe_by_name, get_recipe_instructions_by_id, get_recipe_ingredients_by_id


class RecipeSearchView(APIView):
    def get(self, request):
        query = request.GET.get("search_recipe_by_name", "")
        if not query:
            return Response({"error": "Query parameter 'search_recipe_by_name' is required."}, status=400)

        # Fetch recipes using the helper function
        recipes = get_recipe_by_name(query)

        # Return the fetched recipes as a response
        return Response({"recipes": recipes})

class RecipeInstructionView(APIView):
    def get(self, request):
        recipe_id = request.GET.get("search_recipe_by_id", "")

        try:
            # Fetch recipe instructions using the helper function
            instructions = get_recipe_instructions_by_id(recipe_id)
            if not instructions:
                raise NotFound(detail="Recipe instructions not found.")
            return Response({"instructions": instructions}, status=200)
        except NotFound as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response({"error": f"An error occurred: {e}"}, status=500)

class RecipeIngredientsView(APIView):
    def get(self, request):
        recipe_id = request.GET.get("search_recipe_by_id", "")

        try:
            # Fetch recipe instructions using the helper function
            ingredients = get_recipe_ingredients_by_id(recipe_id)
            if not ingredients:
                raise NotFound(detail="Recipe instructions not found.")
            return Response({"ingredients": ingredients}, status=200)
        except NotFound as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response({"error": f"An error occurred: {e}"}, status=500)