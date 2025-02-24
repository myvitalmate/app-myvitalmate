package com.myvitalmate.app.dto;

import com.myvitalmate.app.interfaces.AiChatResponseInterface;

public record LlamaResponseDTO(String llamaResponse) implements AiChatResponseInterface {

    @Override
    public String getResponse() {
        if (llamaResponse != null && !llamaResponse.isEmpty()) {
            return llamaResponse;
        }
        return "No response received.";
    }
}
