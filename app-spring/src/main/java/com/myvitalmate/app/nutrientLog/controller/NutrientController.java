package com.myvitalmate.app.nutrientLog.controller;

import com.myvitalmate.app.nutrientLog.dto.*;
import com.myvitalmate.app.nutrientLog.service.NutrientTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "nutrients")
public class NutrientController {

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
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) UUID anonymousPatientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate logDate
    ) {
        nutrientTrackerService.logFoodEntry(dto, patientId, anonymousPatientId, logDate);
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

    @GetMapping("/macronutrients/total")
    public ResponseEntity<NutrientTotalDTO> getMacronutrientTotals(
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        NutrientTotalDTO totals = nutrientTrackerService.getMacronutrientTotals(
                patientId, startDate, endDate);
        return ResponseEntity.ok(totals);
    }

    @GetMapping("/micronutrients/total")
    public ResponseEntity<NutrientTotalDTO> getMicronutrientTotals(
            @RequestParam Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        NutrientTotalDTO totals = nutrientTrackerService.getMicronutrientTotals(
                patientId, startDate, endDate);
        return ResponseEntity.ok(totals);
    }

    @GetMapping("/latest-entries")
    public ResponseEntity<List<FoodEntryDTO>> getLatestFoodEntries(
            @RequestParam Long patientId,
            @RequestParam int limit
    ) {
        List<FoodEntryDTO> latestEntries = nutrientTrackerService.getLatestFoodEntries(patientId, limit);
        return ResponseEntity.ok(latestEntries);
    }

    @DeleteMapping("")
    public ResponseEntity<Void> deleteFoodEntry(
            @RequestParam long foodId
    ) {
        nutrientTrackerService.deleteFoodEntry(foodId);
        return ResponseEntity.ok().build();
    }
}
