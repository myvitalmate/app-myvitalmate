import os

import requests  # Required for making HTTP requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Spoonacular API settings
base_url = "https://api.spoonacular.com"
search_recipes_by_name = "/recipes/complexSearch"
search_recipes_by_id = "/recipes/:id/analyzedInstructions?stepBreakdown=true&apiKey="
spoonacular_API_KEY = os.getenv("spoonacular_API_KEY")


# Function to get recipes by name
def get_recipe_by_name(search_recipe_by_name):
    if not spoonacular_API_KEY:
        raise ValueError("API key not found. Please set it in the .env file.")
    # Build the API request URL
    params = {
        "query": search_recipe_by_name,
        "apiKey": spoonacular_API_KEY
    }

    try:
        # Send GET request to the API
        recipe_response = requests.get(base_url + search_recipes_by_name, params=params)
        recipe_response.raise_for_status()

        # Parse JSON response
        recipes = recipe_response.json().get("results", [])

        # Extract title and image URL
        extracted_recipes = [
            {"id": recipe.get("id"), "title": recipe.get("title"), "image": recipe.get("image")}
            for recipe in recipes
        ]

        return extracted_recipes

    except requests.exceptions.RequestException as e:
        # Handle request errors
        print(f"An error occurred: {e}")
        return []


def get_recipe_instructions_by_id(recipe_id):
    """
    Get the analyzed instructions for a recipe by ID.
    """
    if not spoonacular_API_KEY:
        raise ValueError("API key not found. Please set it in the .env file.")

    # Replace placeholder `:id` with the actual recipe ID
    endpoint = f"/recipes/{recipe_id}/analyzedInstructions"
    params = {
        "stepBreakdown": "true",
        "apiKey": spoonacular_API_KEY
    }

    try:
        response = requests.get(base_url + endpoint, params=params)
        response.raise_for_status()
        instructions = response.json()

        extracted_instructions = []
        for instruction in instructions:
            for step in instruction.get('steps', []):
                extracted_instructions.append({
                    "number": step.get("number"),
                    "step": step.get("step")
                })

        return extracted_instructions

    except requests.exceptions.RequestException as e:
        print(f"Error while fetching recipe instructions: {e}")
        return None

def round_ingredient_amount(amount, unit):
    if unit == "g":
        if amount >= 1000:
            return round(amount / 1000, 1)
        else:
            return round(amount / 10) * 10
    else:
        return amount

def get_recipe_ingredients_by_id(recipe_id):

    if not spoonacular_API_KEY:
        raise ValueError("API key not found. Please set it in the .env file.")

    endpoint = f"/recipes/{recipe_id}/ingredientWidget.json"
    params = {
        "apiKey": spoonacular_API_KEY
    }

    try:
        response = requests.get(base_url + endpoint, params=params)
        response.raise_for_status()
        ingredients = response.json()

        extract_ingredients = []
        for ingredient in ingredients.get("ingredients", []):
            amount = ingredient.get("amount", {}).get("metric", {}).get("value", "N/A")
            amount_unit = ingredient.get("amount", {}).get("metric", {}).get("unit", "N/A")

            try:
                amount = float(amount)
                amount = round_ingredient_amount(amount, amount_unit)
            except ValueError:
                pass

            extract_ingredients.append({
                "name": ingredient.get("name"),
                "amount": amount,
                "amount_unit": amount_unit,
            })

        return extract_ingredients

    except requests.exceptions.RequestException as e:
        print(f"Error while fetching recipe ingredients: {e}")
        return None