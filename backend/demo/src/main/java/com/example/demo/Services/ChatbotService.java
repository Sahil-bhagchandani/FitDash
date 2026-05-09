package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Models.UserLogs;
import com.example.demo.Models.WaterLogs;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Repositories.WaterLogRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private final String apiKey;
    private final String model;
    private final UserRepository userRepository;
    private final UserLogRepository userLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public ChatbotService(@Value("${openrouter.api.key}") String apiKey,
                          @Value("${openrouter.chatbot.model:openrouter/free}") String model,
                          UserRepository userRepository,
                          UserLogRepository userLogRepository,
                          WaterLogRepository waterLogRepository) {
        this.apiKey = apiKey;
        this.model = model;
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.waterLogRepository = waterLogRepository;
    }

    public String getSuggestion(String username, String userPrompt) {
        try {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null) return "User not found.";
            if (apiKey == null || apiKey.isBlank()) {
                return "OpenRouter API key is missing. Set OPENROUTER_API_KEY before using AI suggestions.";
            }

            String userId = user.getId();
            List<UserLogs> foodLogs = userLogRepository.findByUserId(userId);
            List<WaterLogs> waterLogs = waterLogRepository.findByUserId(userId);

            String context = buildContext(foodLogs, waterLogs);
            String fullPrompt = buildPrompt(userPrompt, context);

            String requestBody = mapper.writeValueAsString(Map.of(
                    "model", model,
                    "temperature", 0.7,
                    "messages", List.of(
                            Map.of("role", "system", "content", "You are a personal health assistant."),
                            Map.of("role", "user", "content", fullPrompt)
                    ),
                    "user", UUID.randomUUID().toString()
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return "OpenRouter API failed with status: " + response.statusCode();
            }

            JsonNode root = mapper.readTree(response.body());
            return root.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            return "Failed to get AI suggestion: " + e.getMessage();
        }
    }

    private String buildContext(List<UserLogs> foodLogs, List<WaterLogs> waterLogs) {
        String foodSummary = foodLogs.stream()
                .map(log -> String.format("%s (%s): %.1f cal, P: %.1f, C: %.1f, F: %.1f",
                        log.getFoodName(), log.getPortion(),
                        log.getCalories(), log.getProtein(), log.getCarbs(), log.getFat()))
                .collect(Collectors.joining("\n"));

        String waterSummary = waterLogs.stream()
                .map(w -> String.format("%s: %.1f ml", w.getDate(), w.getAmount()))
                .collect(Collectors.joining("\n"));

        return String.format("User's food log today:\n%s\n\nUser's water intake:\n%s", foodSummary, waterSummary);
    }

    private String buildPrompt(String userPrompt, String context) {
        return String.format("""
            The user has provided this health-related prompt: "%s"
            Here is their current consumption context:
            %s
            Based on this, give suggestions, advice, or next steps in a friendly, concise way.
        """, userPrompt, context);
    }
}
