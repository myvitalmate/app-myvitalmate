package com.myvitalmate.app.nutrientLog.dto;

import java.time.LocalDate;
import java.util.List;

public record NutrientLogDTO(
        LocalDate logDate,
        Long patientId,
        List<FoodEntryDTO> foodEntries
) {
}
