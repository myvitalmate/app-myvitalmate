package com.myvitalmate.app.test.chat;

import com.myvitalmate.app.chat.dto.ChatResponseDTO;
import com.myvitalmate.app.chat.service.ChatService;
import com.myvitalmate.app.chat.service.ChatServiceDispatcher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class ChatServiceDispatcherTest {

    private final ChatService mockGptService = Mockito.mock(ChatService.class);
    private ChatServiceDispatcher dispatcher;

    @BeforeEach
    void setUp() {
        Map<String, ChatService> chatServices = new HashMap<>();
        String modelName = "gpt";
        chatServices.put(modelName, mockGptService);

        dispatcher = new ChatServiceDispatcher(chatServices);
    }

    @Test
    @DisplayName("Should return response from the correct ChatService implementation")
    void getChatResponse_shouldDelegateToCorrectService() {
        // Arrange
        String inputMessage = "Hello world";
        ChatResponseDTO expectedResponse = new ChatResponseDTO("Hi there!");
        when(mockGptService.getChatResponse(inputMessage)).thenReturn(expectedResponse);

        // Act
        ChatResponseDTO actualResponse = dispatcher.getChatResponse("gpt", inputMessage);

        // Assert
        assertNotNull(actualResponse);
        assertEquals("Hi there!", actualResponse.message());
        verify(mockGptService, times(1)).getChatResponse(inputMessage);
    }

    @Test
    @DisplayName("Should return error response when model is unsupported")
    void getChatResponse_shouldHandleUnsupportedModel() {
        // Act
        ChatResponseDTO response = dispatcher.getChatResponse("unknown", "message");

        // Assert
        assertNotNull(response);
        assertEquals("Unsupported model: unknown", response.message());
    }
}
