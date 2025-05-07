package com.myvitalmate.app.nutrientLog.controller;

import com.myvitalmate.app.nutrientLog.dto.FoodEntryDTO;
import com.myvitalmate.app.nutrientLog.dto.IngredientResponseDTO;
import com.myvitalmate.app.nutrientLog.dto.NutrientLogDTO;
import com.myvitalmate.app.nutrientLog.dto.NutrientValuesDTO;
import com.myvitalmate.app.nutrientLog.repository.FoodEntryRepository;
import com.myvitalmate.app.nutrientLog.service.NutrientTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "nutrients")
public class NutrientController {

    @Autowired
    private FoodEntryRepository foodEntryRepository;

    @Autowired
    private NutrientTrackerService nutrientTrackerService;

    @GetMapping("/ingredients")
    public List<IngredientResponseDTO.IngredientNameDTO> getIngredients(@RequestParam String ingredientName) {
        return nutrientTrackerService.getIngredient(ingredientName);
    }

    @GetMapping("/nutrientValues")
    public List<NutrientValuesDTO> getNutrientValues(@RequestParam int ingredientId, double amount, String unit) {
        return nutrientTrackerService.getNutrientValues(ingredientId, (int) amount, unit);
    }

    @PostMapping("/log-food")
    public ResponseEntity<?> logFood(
            @RequestBody FoodEntryDTO dto,
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate
    ) {
        nutrientTrackerService.logFoodEntry(dto, patientId, logDate);
        return ResponseEntity.ok("Food entry logged.");
    }

    @GetMapping("/log")
    public ResponseEntity<NutrientLogDTO> getNutrientLog(
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate
    ) {
        NutrientLogDTO nutrientLog = nutrientTrackerService.getNutrientLog(patientId, logDate);
        return ResponseEntity.ok(nutrientLog);
    }

}
