package com.myvitalmate.app.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ChatMemoryService {
    private final Map<String, List<String>> chatHistory = new HashMap<>();

    public void saveUserMessage(String userId, String message) {
        chatHistory.putIfAbsent(userId, new ArrayList<>());
        chatHistory.get(userId).add("User: " + message);
    }

    public void saveBotResponse(String userId, String response) {
        chatHistory.get(userId).add("Bot: " + response);
    }

    public List<String> getChatHistory(String userId) {
        return chatHistory.getOrDefault(userId, new ArrayList<>());
    }
}
