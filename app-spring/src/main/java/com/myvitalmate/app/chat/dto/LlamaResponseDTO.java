package com.myvitalmate.app.chat.dto;

public record LlamaResponseDTO(String llamaResponse) implements IChatResponseDTO {

    @Override
    public String getResponse() {
        if (llamaResponse != null && !llamaResponse.isEmpty()) {
            return llamaResponse;
        }
        return "No response received.";
    }
}
