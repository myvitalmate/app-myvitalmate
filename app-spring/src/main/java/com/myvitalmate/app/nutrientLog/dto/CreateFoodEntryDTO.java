package com.myvitalmate.app.nutrientLog.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CreateFoodEntryDTO(
        String ingredientName,
        int ingredientId,
        double amount,
        String unit,
        LocalDateTime timestamp,
        List<NutrientValuesDTO> nutrients
) {
}
