package com.myvitalmate.app.chat.service;

import com.myvitalmate.app.chat.dto.ChatResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * inside of Map the String represents the name of the bean,
 * the chosen bean is defined by the Interface and is searched for later on in aiChatService.get(model...());
 * service of the type ChatService is searched for variable is called model for easier understanding
 */

@Service
public class ChatServiceDispatcher {

    private static final Logger logger = LoggerFactory.getLogger(ChatServiceDispatcher.class);
    private final Map<String, ChatService> chatServices;

    public ChatServiceDispatcher(Map<String, ChatService> chatServices) {
        this.chatServices = chatServices;
    }

    public ChatResponseDTO getChatResponse(String model, String message) {
        logger.info("Received request for model: {} with message: {}", model, message);

        ChatService service = chatServices.get(model.toLowerCase());
        if (service == null) {
            logger.error("Unsupported model: {}", model);
            return new ChatResponseDTO("Unsupported model: " + model);
        }

        return service.getChatResponse(message);
    }
}
