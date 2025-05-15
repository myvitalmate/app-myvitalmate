package com.myvitalmate.app.nutrientLog.dto;

import java.util.Map;

public record NutrientTotalDTO(
        Map<String, NutrientValueDTO> nutrients
) {
    public record NutrientValueDTO(
            double amount,
            String unit
    ) {
    }
}