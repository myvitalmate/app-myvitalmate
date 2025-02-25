package com.myvitalmate.app.chat.controller;

import com.myvitalmate.app.chat.dto.ChatPromptRequest;
import com.myvitalmate.app.chat.dto.ChatResponseDTO;
import com.myvitalmate.app.chat.service.ChatServiceDispatcher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat/message/")
public class ChatController {

    private final ChatServiceDispatcher chatServiceDispatcher;

    public ChatController(ChatServiceDispatcher chatServiceDispatcher) {
        this.chatServiceDispatcher = chatServiceDispatcher;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDTO> chatResponse(@RequestBody ChatPromptRequest request) {
        ChatResponseDTO response = chatServiceDispatcher.getChatResponse(request.model(), request.message());
        return ResponseEntity.ok(response);
    }
}
