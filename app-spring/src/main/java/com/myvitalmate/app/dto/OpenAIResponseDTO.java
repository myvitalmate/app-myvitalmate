package com.myvitalmate.app.dto;

import com.myvitalmate.app.interfaces.AiChatResponseInterface;

import java.util.List;

public record OpenAIResponseDTO(List<Choice> choices) implements AiChatResponseInterface {

    @Override
    public String getResponse() {
        if (choices != null && !choices.isEmpty() && choices.get(0).message() != null) {
            return choices.get(0).message().content();
        }
        return "No response received.";
    }

    public record Choice(Message message) {
        public record Message(String role, String content) {
        }
    }
}
