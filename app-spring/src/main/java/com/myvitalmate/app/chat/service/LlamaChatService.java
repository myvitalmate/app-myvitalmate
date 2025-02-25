package com.myvitalmate.app.chat.service;

import com.myvitalmate.app.chat.dto.ChatResponseDTO;
import com.myvitalmate.app.chat.dto.LlamaResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("llama")
public class LlamaChatService implements ChatService {

    private static final Logger logger = LoggerFactory.getLogger(LlamaChatService.class);
    @Autowired
    private ChatModel chatModel;

    @Override
    public ChatResponseDTO getChatResponse(String message) {
        logger.info("Sending message to LLaMA model: {}", message);

        try {
            String llamaResponse = chatModel.call(message);
            LlamaResponseDTO responseDTO = new LlamaResponseDTO(llamaResponse);
            return new ChatResponseDTO(responseDTO.getResponse());

        } catch (Exception e) {
            logger.error("Error during LLaMA request: {}", e.getMessage());
            return new ChatResponseDTO("Error communicating with LLaMA model: " + e.getMessage());
        }
    }
}
