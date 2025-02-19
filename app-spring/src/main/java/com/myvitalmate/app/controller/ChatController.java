package com.myvitalmate.app.controller;

import com.myvitalmate.app.dto.PromptRequest;
import com.myvitalmate.app.service.ChatService;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat/message/")
public class ChatController {

    private final ChatModel chatModel;
    private final ChatService chatService;

    public ChatController(ChatModel chatModel, ChatService chatService) {
        this.chatModel = chatModel;
        this.chatService = chatService;
    }

    //TODO return json. not string
    @PostMapping
    public String chat(@RequestBody PromptRequest request) {
        return chatService.getChatResponse(request);
    }
}
