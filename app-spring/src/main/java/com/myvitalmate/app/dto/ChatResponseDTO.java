package com.myvitalmate.app.dto;

import java.util.List;

public record ChatResponseDTO(List<Choice> choices, String llamaResponse) {

    //TODO create interface for seperation of concern. Abstract class -> more scaleable.
    public String getFirstMessageContent() {
        // If GPT response exists, return the first choice
        if (choices != null && !choices.isEmpty() && choices.get(0).message() != null) {
            return choices.get(0).message().content();
        }
        // If Llama response exists, return it directly
        if (llamaResponse != null && !llamaResponse.isEmpty()) {
            return llamaResponse;
        }
        return "No response received.";
    }

    public record Choice(Message message) {
        public record Message(String role, String content) {
        }
    }
}