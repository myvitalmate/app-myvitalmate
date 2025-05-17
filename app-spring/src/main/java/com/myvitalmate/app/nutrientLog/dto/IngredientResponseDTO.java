package com.myvitalmate.app.nutrientLog.dto;

import java.util.List;

public record IngredientResponseDTO(
        List<IngredientNameDTO> results,
        int offset,
        int number,
        int totalResults
) {
    public record IngredientNameDTO(
            int id,
            String name,
            String image
    ) {
    }
}