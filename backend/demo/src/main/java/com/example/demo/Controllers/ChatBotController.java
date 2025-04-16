package com.example.demo.Controllers;

import com.example.demo.Models.ChatBotRequest;
import com.example.demo.Services.ChatbotService;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;


@RestController
@RequestMapping("/api/chatbot")
public class ChatBotController {
    private static final Logger logger = LoggerFactory.getLogger(ChatBotController.class);
    @Autowired
    private ChatbotService chatbotService;

    // Endpoint to fetch the AI-generated response based on user prompt
    @PostMapping("/get-suggestion")
    public String getSuggestion(@RequestBody ChatBotRequest request) {
        
        try {
            // Call the service to get the suggestion
            logger.info("Received request: username={}, userPrompt={}", request.getUsername(), request.getUserPrompt());
            
            String suggestion =  chatbotService.getSuggestion(request.getUsername(), request.getUserPrompt());
            logger.info("AI Suggestion: {}", suggestion);
            return suggestion;
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Failed to process the request: " + e.getMessage();
        }
    }
}
