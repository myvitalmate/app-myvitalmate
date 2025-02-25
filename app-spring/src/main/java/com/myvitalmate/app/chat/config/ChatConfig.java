package com.myvitalmate.app.chat.config;

import com.myvitalmate.app.chat.service.ChatService;
import com.myvitalmate.app.chat.service.ChatServiceDispatcher;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class ChatConfig {

    @Bean
    public ChatServiceDispatcher chatServices(Map<String, ChatService> chatServices) {
        return new ChatServiceDispatcher(chatServices);
    }
}
