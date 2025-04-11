package com.myvitalmate.app.recipe.service;

import com.myvitalmate.app.recipe.dto.RecipeIngredientsDTO;
import com.myvitalmate.app.recipe.dto.RecipeInstructionsDTO;
import com.myvitalmate.app.recipe.dto.RecipeResponseDTO;
import com.myvitalmate.app.recipe.dto.RecipeResultsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private static final Logger logger = LoggerFactory.getLogger(RecipeService.class);
    private final String base_url = "https://api.spoonacular.com";
    @Autowired
    private RestTemplate restTemplate;
    @Value("${spoonacular.api.key}")
    private String apiKey;

    public List<RecipeResultsDTO> getRecipesByName(String searchRecipeByName) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the customApplication.properties file.");
        }

        String url = UriComponentsBuilder.fromUriString(base_url + "/recipes/complexSearch")
                .queryParam("query", searchRecipeByName)
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            ResponseEntity<RecipeResponseDTO> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    }
            );

            RecipeResponseDTO recipeResponseDTO = responseEntity.getBody();

            if (recipeResponseDTO == null || recipeResponseDTO.results() == null) {
                return List.of();
            }

            return recipeResponseDTO.results().stream()
                    .map(result -> new RecipeResultsDTO(
                            result.id(),
                            result.title(),
                            result.image()
                    ))
                    .collect(Collectors.toList());

        } catch (RestClientException e) {
            logger.error("API request failed: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred: {}", e.getMessage());
        }

        return List.of();
    }

    public List<RecipeInstructionsDTO> getRecipeInstructionsById(int searchRecipeById) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the customApplication.properties file.");
        }

        String url = UriComponentsBuilder.fromUriString(base_url + "/recipes/" + searchRecipeById + "/analyzedInstructions")
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            List<Map<String, Object>> instructionsList = restTemplate.getForObject(url, List.class);

            List<RecipeInstructionsDTO> extractedInstructions = new ArrayList<>();

            if (instructionsList != null) {
                for (Map<String, Object> instruction : instructionsList) {
                    List<Map<String, Object>> steps = (List<Map<String, Object>>) instruction.get("steps");

                    if (steps != null) {
                        for (Map<String, Object> step : steps) {
                            int number = (int) step.get("number");
                            String stepDescription = (String) step.get("step");

                            extractedInstructions.add(new RecipeInstructionsDTO(number, stepDescription));
                        }
                    }
                }
            }

            return extractedInstructions;

        } catch (Exception e) {
            System.out.println("Error while fetching recipe instructions: " + e.getMessage());
            return List.of();
        }
    }

    private double roundIngredientAmount(double amount, String unit) {
        if ("g".equalsIgnoreCase(unit)) {
            if (amount >= 1000) {
                return Math.round((amount / 1000) * 10.0) / 10.0;
            } else {
                return Math.round(amount / 10) * 10;
            }
        } else if ("ml".equalsIgnoreCase(unit)) {
            if (amount >= 1000) {
                return Math.round((amount / 1000) * 10.0) / 10.0;
            } else {
                return Math.round(amount / 10) * 10;
            }
        }
        return amount;
    }

    private String normalizeUnit(double amount, String unit) {
        if ("g".equalsIgnoreCase(unit) && amount >= 1000) {
            return "kg";
        } else if ("ml".equalsIgnoreCase(unit) && amount >= 1000) {
            return "L";
        }
        return unit;
    }

    public List<RecipeIngredientsDTO> getRecipeIngredientsById(int searchRecipeById) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the customApplication.properties file.");
        }

        String url = UriComponentsBuilder.fromUriString(base_url + "/recipes/" + searchRecipeById + "/ingredientWidget.json")
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<RecipeIngredientsDTO> extractedIngredients = new ArrayList<>();

            if (response != null && response.containsKey("ingredients")) {
                List<Map<String, Object>> ingredientsList = (List<Map<String, Object>>) response.get("ingredients");

                for (Map<String, Object> ingredient : ingredientsList) {
                    String name = (String) ingredient.get("name");

                    Map<String, Object> amountMap = (ingredient.get("amount") instanceof Map)
                            ? (Map<String, Object>) ingredient.get("amount")
                            : Collections.emptyMap();
                    Map<String, Object> metric = (amountMap.get("metric") instanceof Map)
                            ? (Map<String, Object>) amountMap.get("metric")
                            : Collections.emptyMap();

                    double amount = (metric.get("value") instanceof Number)
                            ? ((Number) metric.get("value")).doubleValue()
                            : 0.0;
                    String amountUnit = (metric.get("unit") instanceof String)
                            ? (String) metric.get("unit")
                            : "N/A";

                    amount = roundIngredientAmount(amount, amountUnit);
                    amountUnit = normalizeUnit(amount, amountUnit);

                    extractedIngredients.add(new RecipeIngredientsDTO(name, amount, amountUnit));
                }
            }

            return extractedIngredients;

        } catch (Exception e) {
            throw new RuntimeException("Error while fetching recipe ingredients: " + e.getMessage(), e);
        }
    }


}
