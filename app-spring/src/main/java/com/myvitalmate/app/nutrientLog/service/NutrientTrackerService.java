package com.myvitalmate.app.nutrientLog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.myvitalmate.app.nutrientLog.dto.CreateFoodEntryDTO;
import com.myvitalmate.app.nutrientLog.dto.IngredientResponseDTO;
import com.myvitalmate.app.nutrientLog.dto.NutrientValuesDTO;
import com.myvitalmate.app.nutrientLog.entity.FoodEntryEntity;
import com.myvitalmate.app.nutrientLog.entity.NutrientEntryEntity;
import com.myvitalmate.app.nutrientLog.entity.NutrientLogEntity;
import com.myvitalmate.app.nutrientLog.mapper.NutrientValuesMapper;
import com.myvitalmate.app.nutrientLog.repository.FoodEntryRepository;
import com.myvitalmate.app.nutrientLog.repository.NutrientLogRepository;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import jakarta.transaction.Transactional;
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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class NutrientTrackerService {

    private static final Logger logger = LoggerFactory.getLogger(NutrientTrackerService.class);
    private final String base_url = "https://api.spoonacular.com";
    @Autowired
    private NutrientValuesMapper nutrientValuesMapper;

    @Autowired
    private NutrientLogRepository nutrientLogRepository;

    @Autowired
    private FoodEntryRepository foodEntryRepository;

    @Autowired
    private RestTemplate restTemplate;
    @Value("${spoonacular.api.key}")
    private String apiKey;

    public List<IngredientResponseDTO.IngredientNameDTO> getIngredient(String ingredientName) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the properties.");
        }

        String url = UriComponentsBuilder.fromUriString(base_url + "/food/ingredients/search")
                .queryParam("query", ingredientName)
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            ResponseEntity<IngredientResponseDTO> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<IngredientResponseDTO>() {
                    }
            );

            IngredientResponseDTO response = responseEntity.getBody();
            return response != null ? response.results() : List.of();

        } catch (RestClientException e) {
            logger.error("API request failed: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred: {}", e.getMessage());
        }

        return List.of();
    }

    public List<NutrientValuesDTO> getNutrientValues(int ingredientId, int amount, String unit) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalArgumentException("API key not found. Please set it in the properties.");
        }

        String url = UriComponentsBuilder.fromUriString(base_url + "/food/ingredients/" + ingredientId + "/information")
                .queryParam("amount", amount)
                .queryParam("unit", unit)
                .queryParam("apiKey", apiKey)
                .toUriString();

        try {
            ResponseEntity<JsonNode> responseEntity = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    }
            );

            JsonNode root = responseEntity.getBody();
            if (root != null && root.has("nutrition") && root.get("nutrition").has("nutrients")) {
                JsonNode nutrientsNode = root.get("nutrition").get("nutrients");

                List<NutrientValuesDTO> nutrientValues = new ArrayList<>();

                for (JsonNode nutrientNode : nutrientsNode) {
                    NutrientValuesDTO nutrient = new NutrientValuesDTO(
                            nutrientNode.has("name") ? nutrientNode.get("name").asText() : "",
                            nutrientNode.has("amount") ? nutrientNode.get("amount").asDouble() : 0.0,
                            nutrientNode.has("unit") ? nutrientNode.get("unit").asText() : ""
                    );
                    nutrientValues.add(nutrient);
                }
                return nutrientValues;
            }
        } catch (RestClientException e) {
            logger.error("API request failed: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred: {}", e.getMessage());
        }
        return List.of();
    }

    @Transactional
    public void logFoodEntry(CreateFoodEntryDTO foodDto, Long patientId, LocalDate logDate) {
        NutrientLogEntity nutrientLog = nutrientLogRepository
                .findByPatientIdAndLogDate(patientId, logDate)
                .orElseGet(() -> {
                    // Create a new PatientProfile instance and set its ID
                    PatientProfile patient = new PatientProfile();
                    patient.setId(patientId);

                    NutrientLogEntity newLog = new NutrientLogEntity();
                    newLog.setPatient(patient);
                    newLog.setLogDate(logDate);
                    return nutrientLogRepository.save(newLog);
                });

        FoodEntryEntity foodEntry = new FoodEntryEntity();
        foodEntry.setIngredientName(foodDto.ingredientName());
        foodEntry.setIngredientId(foodDto.ingredientId());
        foodEntry.setAmount(foodDto.amount());
        foodEntry.setUnit(foodDto.unit());
        foodEntry.setTimestamp(foodDto.timestamp());
        foodEntry.setNutrientLog(nutrientLog);

        List<NutrientValuesDTO> nutrientsDto = getNutrientValues(
                foodDto.ingredientId(),
                (int) foodDto.amount(),
                foodDto.unit()
        );

        List<NutrientEntryEntity> nutrientEntities = nutrientsDto.stream()
                .map(dto -> {
                    NutrientEntryEntity entity = nutrientValuesMapper.toEntity(dto);
                    entity.setFoodEntry(foodEntry);
                    return entity;
                }).toList();

        foodEntry.setNutrients(nutrientEntities);

        foodEntryRepository.save(foodEntry);
    }
}