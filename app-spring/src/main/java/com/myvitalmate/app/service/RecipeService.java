package com.myvitalmate.app.service;

import com.myvitalmate.app.dto.RecipeIngredientsDTO;
import com.myvitalmate.app.dto.RecipeInstructionsDTO;
import com.myvitalmate.app.dto.RecipeResponseDTO;
import com.myvitalmate.app.dto.RecipeResultsDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
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
@PropertySource("classpath:APIs.properties")
public class RecipeService {

    private final RestTemplate restTemplate;
    private final String base_url = "https://api.spoonacular.com";
    @Value("${spoonacular.api.key}")
    private String apiKey;

    public RecipeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<RecipeResultsDTO> getRecipesByName(String searchRecipeByName) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the APIs.properties file.");
        }

        // Build the API request URL
        String url = UriComponentsBuilder.fromHttpUrl(base_url + "/recipes/complexSearch")
                .queryParam("query", searchRecipeByName)
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            // Send GET request and parse the response
            ResponseEntity<RecipeResponseDTO> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    }
            );

            RecipeResponseDTO recipeResponseDTO = responseEntity.getBody();

            // Ensure results list is not null
            if (recipeResponseDTO == null || recipeResponseDTO.results() == null) {
                return List.of();
            }

            // Convert each map in the results list to a RecipeResultsDTO
            return recipeResponseDTO.results().stream()
                    .map(result -> new RecipeResultsDTO(
                            result.id(),
                            result.title(),
                            result.image()
                    ))
                    .collect(Collectors.toList());

        } catch (RestClientException e) {
            // Handle API request failures
            System.err.println("API request failed: " + e.getMessage());
        } catch (Exception e) {
            // Handle unexpected exceptions
            System.err.println("An unexpected error occurred: " + e.getMessage());
        }

        return List.of(); // Return an empty list if an error occurs
    }

    public List<RecipeInstructionsDTO> getRecipeInstructionsById(int searchRecipeById) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the APIs.properties file.");
        }

        // Construct the API URL
        String url = UriComponentsBuilder.fromHttpUrl(base_url + "/recipes/" + searchRecipeById + "/analyzedInstructions")
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            //every instructionList object represents a recipe
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
                return Math.round((amount / 1000) * 10.0) / 10.0; // Convert to kg with 1 decimal place
            } else {
                return Math.round(amount / 10) * 10; // Round to nearest 10g
            }
        } else if ("ml".equalsIgnoreCase(unit)) {
            if (amount >= 1000) {
                return Math.round((amount / 1000) * 10.0) / 10.0; // Convert to L with 1 decimal place
            } else {
                return Math.round(amount / 10) * 10; // Round to nearest 10ml
            }
        }
        return amount; // Return unmodified for other units
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
            throw new IllegalArgumentException("API key not found. Please set it in the APIs.properties file.");
        }

        // Construct API URL
        String url = UriComponentsBuilder.fromHttpUrl(base_url + "/recipes/" + searchRecipeById + "/ingredientWidget.json")
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            List<RecipeIngredientsDTO> extractedIngredients = new ArrayList<>();

            if (response != null && response.containsKey("ingredients")) {
                List<Map<String, Object>> ingredientsList = (List<Map<String, Object>>) response.get("ingredients");

                for (Map<String, Object> ingredient : ingredientsList) {
                    String name = (String) ingredient.get("name");

                    // Extract amount and unit safely
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

                    // Apply rounding and unit normalization
                    amount = roundIngredientAmount(amount, amountUnit);
                    amountUnit = normalizeUnit(amount, amountUnit);

                    // Add to DTO list
                    extractedIngredients.add(new RecipeIngredientsDTO(name, amount, amountUnit));
                }
            }

            return extractedIngredients;

        } catch (Exception e) {
            throw new RuntimeException("Error while fetching recipe ingredients: " + e.getMessage(), e);
        }
    }


}
