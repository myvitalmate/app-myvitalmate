//package com.myvitalmate.app.service;
//
//
//import com.myvitalmate.app.dto.ChatRequestDTO;
//import com.myvitalmate.app.dto.ChatResponseDTO;
//import com.myvitalmate.app.dto.PromptRequest;
//import org.springframework.ai.chat.model.ChatModel;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.PropertySource;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestClient;
//
//import java.util.List;
//
//@Service
//@PropertySource("classpath:APIs.properties")
//public class ChatService {
//    private final RestClient restClient;
//    private final ChatModel chatModel;
//
//
//    @Value("${openai.api.key}")
//    private String apiKey;
//
//    @Value("${openai.api.model}")
//    private String gptModel;
//
//    @Value("${spring.ai.ollama.chat.options.model}")
//    private String llamaModel;
//
//    @Autowired
//    public ChatService(RestClient restClient, ChatModel chatModel) {
//        this.restClient = restClient;
//        this.chatModel = chatModel;
//    }
//
//    public String getChatResponse(PromptRequest request) {
//        String selectedModel = switch (request.model().toLowerCase()) {
//            case "gpt" -> gptModel;
//            case "llama" -> llamaModel;
//            default -> gptModel;
//        };
//
//        ChatRequestDTO chatRequestDTO = new ChatRequestDTO(
//                selectedModel,
//                List.of(new ChatRequestDTO.Message("user", request.message()))
//        );
//
//        ChatResponseDTO responseDTO;
//        //TODO Service request into sperated services -> scaleable abstrct classes?
//        if ("gpt".equalsIgnoreCase(request.model())) {
//            // OpenAI GPT Response Handling
//            ChatResponseDTO gptResponse = restClient.post()
//                    .header("Authorization", "Bearer " + apiKey)
//                    .body(chatRequestDTO)
//                    .retrieve()
//                    .body(ChatResponseDTO.class);
//
//            responseDTO = new ChatResponseDTO(gptResponse.choices(), null);
//        } else {
//            // Llama Response Handling (now correctly storing the String response)
//            String llamaResponse = chatModel.call(request.message());
//            responseDTO = new ChatResponseDTO(null, llamaResponse);
//        }
//
//        return responseDTO.getFirstMessageContent();
//    }
//}