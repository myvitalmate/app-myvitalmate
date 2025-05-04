package com.myvitalmate.app.dietProtocol.controller;

import com.myvitalmate.app.dietProtocol.dto.IngredientResponseDTO;
import com.myvitalmate.app.dietProtocol.service.NutrientTrackerService;
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
    public List<IngredientResponseDTO.IngredientNameDTO> getIngredients(@RequestParam("ingredientName") String ingredientName) {
        return nutrientTrackerService.getIngredient(ingredientName);
    }

}
