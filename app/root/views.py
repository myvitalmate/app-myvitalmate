from django.http import JsonResponse
from django.shortcuts import render

from .ai_chatbot import parse_user_input
from .recipes_search import get_recipe_by_name, get_recipe_instructions_by_id


def home(request):
    if request.method == "POST":
        user_input = request.POST.get("user_input", "")

        try:
            ai_response = parse_user_input(user_input)
        except Exception as e:
            ai_response = f"An error occurred: {e}"

        return render(request, "home.html", {"ai_response": ai_response})

    if request.method == "GET":
        search_recipe_by_name = request.GET.get("search_recipe_by_name", "")

        # Initialize response to None or a default value
        extracted_recipes = None

        # Check if the query is provided
        if search_recipe_by_name:
            try:
                # Call the API function to fetch recipes
                extracted_recipes = get_recipe_by_name(search_recipe_by_name)
            except Exception as e:
                # Handle exceptions and set response
                extracted_recipes = f"An error occurred: {e}"

        # Render the template with the response context
        return render(request, "home.html", {"extracted_recipes": extracted_recipes})


def recipe_instructions(request, recipe_id):
    """
    Fetch recipe instructions based on the recipe ID.
    """
    try:
        # Call the helper function to get instructions
        instructions = get_recipe_instructions_by_id(recipe_id)
        return JsonResponse({"instructions": instructions})
    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {e}"}, status=500)
