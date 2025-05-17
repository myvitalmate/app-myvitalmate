package com.myvitalmate.app.nutrientLog.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.myvitalmate.app.nutrientLog.dto.*;
import com.myvitalmate.app.nutrientLog.entity.FoodEntryEntity;
import com.myvitalmate.app.nutrientLog.entity.NutrientEntryEntity;
import com.myvitalmate.app.nutrientLog.entity.NutrientLogEntity;
import com.myvitalmate.app.nutrientLog.mapper.NutrientValuesMapper;
import com.myvitalmate.app.nutrientLog.repository.FoodEntryRepository;
import com.myvitalmate.app.nutrientLog.repository.NutrientEntryRepository;
import com.myvitalmate.app.nutrientLog.repository.NutrientLogRepository;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NutrientTrackerService {

    private static final Logger logger = LoggerFactory.getLogger(NutrientTrackerService.class);
    private static final List<String> MACRONUTRIENTS = List.of(
            "Calories", "Protein", "Fat", "Carbohydrates", "Fiber", "Sugar",
            "Saturated Fat", "Monounsaturated Fat", "Polyunsaturated Fat", "Trans Fat",
            "Cholesterol"
    );
    private static final List<String> MICRONUTRIENTS = List.of(
            // Fat-soluble vitamins
            "Vitamin A", "Vitamin D", "Vitamin E", "Vitamin K",

            // Water-soluble vitamins
            "Vitamin C", "Vitamin B1 (Thiamine)", "Vitamin B2 (Riboflavin)",
            "Vitamin B3 (Niacin)", "Vitamin B5 (Pantothenic Acid)",
            "Vitamin B6 (Pyridoxine)", "Vitamin B7 (Biotin)",
            "Vitamin B9 (Folate)", "Vitamin B12 (Cobalamin)",

            // Major minerals (macrominerals)
            "Calcium", "Magnesium", "Phosphorus", "Potassium", "Sodium",
            "Chloride", "Sulfur",

            // Trace elements (microminerals)
            "Iron", "Zinc", "Copper", "Manganese", "Iodine", "Selenium",
            "Molybdenum", "Fluoride", "Chromium", "Cobalt"
    );
    private final String base_url = "https://api.spoonacular.com";
    @Autowired
    private NutrientValuesMapper nutrientValuesMapper;
    @Autowired
    private NutrientLogRepository nutrientLogRepository;
    @Autowired
    private NutrientEntryRepository nutrientEntryRepository;
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
                    new ParameterizedTypeReference<>() {
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
    public void logFoodEntry(FoodEntryDTO foodDto, Long patientId, LocalDate logDate) {
        NutrientLogEntity nutrientLog = nutrientLogRepository
                .findByPatientIdAndLogDate(patientId, logDate)
                .orElseGet(() -> {
                    PatientProfile patient = new PatientProfile();
                    patient.setId(patientId);

                    NutrientLogEntity newLog = new NutrientLogEntity();
                    newLog.setPatient(patient);
                    newLog.setLogDate(logDate);
                    return nutrientLogRepository.save(newLog);
                });

        FoodEntryEntity foodEntry = new FoodEntryEntity();
        foodEntry.setId(foodDto.id());
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

    public NutrientLogDTO getNutrientLog(Long patientId, LocalDate logDate) {
        return nutrientLogRepository
                .findByPatientIdAndLogDate(patientId, logDate)
                .map(nutrientLog -> {
                    List<FoodEntryDTO> foodEntryDTOs = nutrientLog.getFoodEntries().stream()
                            .map(this::convertToFoodEntryDTO)
                            .toList();

                    return new NutrientLogDTO(
                            nutrientLog.getLogDate(),
                            nutrientLog.getPatient().getId(),
                            foodEntryDTOs
                    );
                })
                .orElse(new NutrientLogDTO(logDate, patientId, List.of()));
    }

    private FoodEntryDTO convertToFoodEntryDTO(FoodEntryEntity entity) {
        List<NutrientValuesDTO> nutrientDTOs = entity.getNutrients().stream()
                .map(nutrientValuesMapper::toDto)
                .toList();

        return new FoodEntryDTO(
                entity.getId(),
                entity.getIngredientName(),
                entity.getIngredientId(),
                entity.getAmount(),
                entity.getUnit(),
                entity.getTimestamp(),
                nutrientDTOs
        );
    }

    public NutrientTotalDTO getMacronutrientTotals(Long patientId, LocalDate startDate, LocalDate endDate) {
        return getNutrientTotals(MACRONUTRIENTS, patientId, startDate, endDate);
    }

    public NutrientTotalDTO getMicronutrientTotals(Long patientId, LocalDate startDate, LocalDate endDate) {
        return getNutrientTotals(MICRONUTRIENTS, patientId, startDate, endDate);
    }

    private NutrientTotalDTO getNutrientTotals(List<String> nutrientNames, Long patientId,
                                               LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = nutrientEntryRepository.sumMultipleNutrientsByDateRange(
                nutrientNames, patientId, startDate, endDate);

        Map<String, NutrientTotalDTO.NutrientValueDTO> nutrientMap = new HashMap<>();

        for (Object[] result : results) {
            String name = (String) result[0];
            Double amount = (Double) result[1];
            String unit = (String) result[2];

            nutrientMap.put(name, new NutrientTotalDTO.NutrientValueDTO(amount, unit));
        }

        for (String nutrient : nutrientNames) {
            if (!nutrientMap.containsKey(nutrient)) {
                nutrientMap.put(nutrient, new NutrientTotalDTO.NutrientValueDTO(0.0, ""));
            }
        }

        return new NutrientTotalDTO(nutrientMap);
    }

    public List<FoodEntryDTO> getLatestFoodEntries(Long patientId, int limit) {
        List<FoodEntryEntity> latestEntries = foodEntryRepository
                .findByNutrientLog_Patient_IdOrderByTimestampDesc(patientId, PageRequest.of(0, limit));

        return latestEntries.stream()
                .map(this::convertToFoodEntryDTO)
                .toList();
    }

    public void deleteFoodEntry(long foodId) {
        try {
            foodEntryRepository.findById(foodId)
                    .orElseThrow(() -> new RuntimeException("Food entry not found"));
        } catch (Exception e) {
            throw new RuntimeException("Error deleting food entry: " + e.getMessage());
        }
        foodEntryRepository.deleteById(foodId);
    }
}
