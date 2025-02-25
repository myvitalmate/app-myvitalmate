package com.myvitalmate.app.recipe.dto;

import java.util.List;

public record RecipeResponseDTO(
        List<RecipeItemDTO> results,
        int offset,
        int number,
        int totalResults
) {
    public record RecipeItemDTO(
            int id,
            String title,
            String image

    ) {
    }
}
