package com.myvitalmate.app.controller;

import com.myvitalmate.app.dto.ChatPromptRequest;
import com.myvitalmate.app.dto.ChatResponseDTO;
import com.myvitalmate.app.service.AIChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat/message/")
public class ChatController {

    private final AIChatService aiChatService;

    public ChatController(AIChatService aiChatService) {
        this.aiChatService = aiChatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chatResponse(@RequestBody ChatPromptRequest request) {
        ChatResponseDTO response = aiChatService.getChatResponse(request.model(), request.message());
        return ResponseEntity.ok(response);  // Return response as JSON
    }
}
