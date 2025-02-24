package com.myvitalmate.app.service;

import com.myvitalmate.app.dto.ChatResponseDTO;
import com.myvitalmate.app.interfaces.AiChatInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AIChatService {

    //inside of Map the String represents the name of the bean,
    //the chosen bean is defined by the Interface and is searched for later on in aiChatService.get(model...());
    private static final Logger logger = LoggerFactory.getLogger(AIChatService.class);
    private final Map<String, AiChatInterface> aiChatServices;

    public AIChatService(Map<String, AiChatInterface> aiChatServices) {
        this.aiChatServices = aiChatServices;
    }

    public ChatResponseDTO getChatResponse(String model, String message) {
        logger.info("Received request for model: {} with message: {}", model, message);

        //service of the type AiChatInterface is searched for variable is called model for easier understanding
        AiChatInterface service = aiChatServices.get(model.toLowerCase());
        if (service == null) {
            logger.error("Unsupported model: {}", model);
            // Return error response in case the model is unsupported
            return new ChatResponseDTO("Unsupported model: " + model);
        }

        // Delegate the response to the specific model's service
        return service.getChatResponse(message);
    }
}
