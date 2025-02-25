package com.myvitalmate.app.recipe.dto;

public record RecipeIngredientsDTO(
        String name,
        double amount,
        String amount_unit) {
}
