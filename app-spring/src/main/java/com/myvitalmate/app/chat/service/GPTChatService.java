package com.myvitalmate.app.chat.service;

import com.myvitalmate.app.chat.dto.ChatRequestDTO;
import com.myvitalmate.app.chat.dto.ChatResponseDTO;
import com.myvitalmate.app.chat.dto.OpenResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service("gpt")
public class GPTChatService implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(GPTChatService.class);

    @Autowired
    private RestTemplate restTemplate;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.api.model}")
    private String gptModel;

    @Override
    public ChatResponseDTO getChatResponse(String message) {
        ChatRequestDTO chatRequestDTO = new ChatRequestDTO(
                gptModel,
                List.of(new ChatRequestDTO.Message("user", message))
        );

        logger.info("Sending request to GPT API: {}", chatRequestDTO);

        String endpoint = apiUrl;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        HttpEntity<ChatRequestDTO> entity = new HttpEntity<>(chatRequestDTO, headers);

        OpenResponseDTO responseDTO;

        try {
            ResponseEntity<OpenResponseDTO> response = restTemplate.exchange(
                    endpoint,
                    HttpMethod.POST,
                    entity,
                    OpenResponseDTO.class
            );

            responseDTO = response.getBody();
        } catch (Exception e) {
            logger.error("Error during GPT API request: {}", e.getMessage());
            return new ChatResponseDTO("Error during GPT API request: " + e.getMessage());
        }

        return new ChatResponseDTO(responseDTO != null ? responseDTO.getResponse() : "No response from API");
    }
}
