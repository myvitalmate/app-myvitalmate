package com.myvitalmate.app.chat.dto;

import java.util.List;

public record OpenResponseDTO(List<Choice> choices) implements IChatResponseDTO {

    @Override
    public String getResponse() {
        if (choices != null && !choices.isEmpty() && choices.getFirst().message() != null) {
            return choices.getFirst().message().content();
        }
        return "No response received.";
    }

    public record Choice(Message message) {
        public record Message(String role, String content) {
        }
    }
}
