package com.myvitalmate.app.service;

import com.myvitalmate.app.dto.ChatResponseDTO;
import com.myvitalmate.app.dto.LlamaResponseDTO;
import com.myvitalmate.app.interfaces.AiChatInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("llama")
public class LlamaChatService implements AiChatInterface {

    private static final Logger logger = LoggerFactory.getLogger(LlamaChatService.class);

    // Injected Spring AI ChatModel
    private final ChatModel chatModel;

    // Constructor-based injection
    @Autowired
    public LlamaChatService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @Override
    public ChatResponseDTO getChatResponse(String message) {
        logger.info("Sending message to LLaMA model: {}", message);

        try {
            // Call the chat model with the message to get the Llama response
            String llamaResponse = chatModel.call(message);  // Assuming call() sends the message and gets the response

            // Wrap the Llama response in a DTO
            LlamaResponseDTO responseDTO = new LlamaResponseDTO(llamaResponse);
            // Return the content of the response or a default message
            return new ChatResponseDTO(responseDTO != null ? responseDTO.getResponse() : "No response from LLaMA");

        } catch (Exception e) {
            logger.error("Error during LLaMA request: {}", e.getMessage());
            return new ChatResponseDTO("Error communicating with LLaMA model: " + e.getMessage());
        }
    }
}
