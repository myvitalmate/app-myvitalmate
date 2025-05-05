package com.myvitalmate.app.nutrientLog.controller;

import com.myvitalmate.app.nutrientLog.dto.IngredientResponseDTO;
import com.myvitalmate.app.nutrientLog.dto.NutrientValuesDTO;
import com.myvitalmate.app.nutrientLog.service.NutrientTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
}
