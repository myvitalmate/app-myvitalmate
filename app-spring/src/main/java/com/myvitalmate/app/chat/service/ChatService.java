package com.myvitalmate.app.chat.service;

import com.myvitalmate.app.chat.dto.ChatResponseDTO;

public interface ChatService {
    ChatResponseDTO getChatResponse(String message);
}
