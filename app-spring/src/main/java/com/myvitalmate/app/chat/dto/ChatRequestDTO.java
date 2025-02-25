package com.myvitalmate.app.chat.dto;

import java.util.List;

public record ChatRequestDTO(String model, List<Message> messages) {
    public record Message(String role, String content) {
    }
}
