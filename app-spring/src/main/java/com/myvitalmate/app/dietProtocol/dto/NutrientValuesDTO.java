package com.myvitalmate.app.dietProtocol.dto;

public record NutrientValuesDTO(
        Macronutrients macro,
        Micronutrients micro
) {
    public record Macronutrients(
            double fat,
            double saturatedFat,
            double carbohydrates,
            double netCarbohydrates,
            double sugar,
            double fiber,
            double protein
    ) {
    }

    public record Micronutrients(
            double cholesterol,
            double sodium,
            double vitaminC,
            double manganese,
            double vitaminB6,
            double copper,
            double vitaminB1,
            double folate,
            double potassium,
            double magnesium,
            double vitaminB3,
            double vitaminB5,
            double vitaminB2,
            double iron,
            double calcium,
            double vitaminA,
            double zinc,
            double phosphorus,
            double vitaminK,
            double selenium,
            double vitaminE
    ) {
    }
}
