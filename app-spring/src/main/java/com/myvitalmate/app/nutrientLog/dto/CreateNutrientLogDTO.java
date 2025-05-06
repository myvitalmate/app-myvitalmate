package com.myvitalmate.app.nutrientLog.dto;

import java.time.LocalDate;
import java.util.List;

public record CreateNutrientLogDTO(
        LocalDate logDate,
        Long patientId,
        List<CreateFoodEntryDTO> foodEntries
) {
}
