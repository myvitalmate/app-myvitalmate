package com.myvitalmate.app.dietProtocol.service;

import com.myvitalmate.app.dietProtocol.dto.IngredientResponseDTO;
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

import java.util.List;

@Service
public class NutrientTrackerService {
    private static final Logger logger = LoggerFactory.getLogger(NutrientTrackerService.class);
    private final String base_url = "https://api.spoonacular.com";
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
}