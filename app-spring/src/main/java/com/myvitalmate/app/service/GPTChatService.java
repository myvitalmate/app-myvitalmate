package com.myvitalmate.app.service;

import com.myvitalmate.app.dto.ChatRequestDTO;
import com.myvitalmate.app.dto.ChatResponseDTO;
import com.myvitalmate.app.dto.OpenAIResponseDTO;
import com.myvitalmate.app.interfaces.AiChatInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service("gpt")
@PropertySource("classpath:APIs.properties")
public class GPTChatService implements AiChatInterface {

    private static final Logger logger = LoggerFactory.getLogger(GPTChatService.class);

    private final RestTemplate restTemplate;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String gptModel;

    public GPTChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public ChatResponseDTO getChatResponse(String message) {
        ChatRequestDTO chatRequestDTO = new ChatRequestDTO(
                gptModel,
                List.of(new ChatRequestDTO.Message("user", message))
        );

        // Log the request payload
        logger.info("Sending request to GPT API: {}", chatRequestDTO);

        String endpoint = apiUrl; // Define full endpoint

        // Prepare HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<ChatRequestDTO> entity = new HttpEntity<>(chatRequestDTO, headers);

        // Initialize responseDTO to handle response
        OpenAIResponseDTO responseDTO = null;

        try {
            // Send the request using RestTemplate
            ResponseEntity<OpenAIResponseDTO> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    OpenAIResponseDTO.class
            );

            // Get the response body
            responseDTO = response.getBody();
        } catch (Exception e) {
            logger.error("Error during GPT API request: {}", e.getMessage());
            return new ChatResponseDTO("Error during GPT API request: " + e.getMessage());
        }

        // Return the first message content or a default message if no response
        return new ChatResponseDTO(responseDTO != null ? responseDTO.getResponse() : "No response from API");
    }
}
