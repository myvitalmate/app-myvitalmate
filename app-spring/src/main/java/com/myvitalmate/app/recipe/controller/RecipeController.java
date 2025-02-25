package com.myvitalmate.app.recipe.controller;

import com.myvitalmate.app.recipe.dto.RecipeIngredientsDTO;
import com.myvitalmate.app.recipe.dto.RecipeInstructionsDTO;
import com.myvitalmate.app.recipe.dto.RecipeResultsDTO;
import com.myvitalmate.app.recipe.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "recipe")
public class RecipeController {

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/search/")
    public ResponseEntity<Map<String, Object>> getRecipesByName(@RequestParam("search_recipe_by_name") String searchRecipeByName) {
        List<RecipeResultsDTO> recipes = recipeService.getRecipesByName(searchRecipeByName);
        return ResponseEntity.ok(Map.of("recipes", recipes));
    }

    @GetMapping("/search/instructions/")
    public ResponseEntity<Map<String, Object>> getRecipesById(@RequestParam("search_recipe_by_id") int recipe_id) {
        List<RecipeInstructionsDTO> instructions = recipeService.getRecipeInstructionsById(recipe_id);
        return ResponseEntity.ok(Map.of("instructions", instructions));
    }

    @GetMapping("/search/ingredients/")
    public ResponseEntity<Map<String, Object>> getRecipeIngredientsById(@RequestParam("search_recipe_by_id") int recipeId) {
        List<RecipeIngredientsDTO> ingredients = recipeService.getRecipeIngredientsById(recipeId);
        return ResponseEntity.ok(Map.of("ingredients", ingredients));
    }
}

