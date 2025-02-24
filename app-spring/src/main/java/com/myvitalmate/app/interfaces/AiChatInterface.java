package com.myvitalmate.app.interfaces;

import com.myvitalmate.app.dto.ChatResponseDTO;

public interface AiChatInterface {
    ChatResponseDTO getChatResponse(String message);
}
