package com.example.demo.Services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.Models.Foods;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenRouterNutritionService {

    private final String apiKey;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();

    public OpenRouterNutritionService(
            @Value("${openrouter.api.key}") String apiKey,
            @Value("${openrouter.nutrition.model:openrouter/free}") String model) {
        this.apiKey = apiKey;
        this.model = model;
    }

    public Foods getNutritionDataFromAI(String name, String description, String portion) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OpenRouter API key is missing. Set OPENROUTER_API_KEY before using AI nutrition lookup.");
        }

        String prompt = buildPrompt(name, description, portion);
        String responseText = null;

        try {
            String requestBody = mapper.writeValueAsString(Map.of(
                    "model", model,
                    "temperature", 0,
                    "messages", List.of(Map.of("role", "user", "content", prompt)),
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
                throw new RuntimeException("OpenRouter API failed with status: " + response.statusCode());
            }

            JsonNode root = mapper.readTree(response.body());
            JsonNode choicesNode = root.path("choices");
            if (!choicesNode.isArray() || choicesNode.isEmpty()) {
                throw new RuntimeException("Invalid response format: choices array missing or empty.");
            }

            responseText = choicesNode.get(0).path("message").path("content").asText();
            JsonNode nutritionNode = mapper.readTree(extractJsonObject(responseText));
            if (!nutritionNode.has("calories") || !nutritionNode.has("protein")
                    || !nutritionNode.has("carbs") || !nutritionNode.has("fat")) {
                throw new RuntimeException("Incomplete nutrition data in response.");
            }

            Foods food = new Foods();
            food.setId(UUID.randomUUID().toString());
            food.setName(name);
            food.setDescription(description);
            food.setPortion(portion);
            food.setCreatedAt(LocalDateTime.now());
            food.setCalories(nutritionNode.get("calories").asDouble());
            food.setProtein(nutritionNode.get("protein").asDouble());
            food.setCarbs(nutritionNode.get("carbs").asDouble());
            food.setFat(nutritionNode.get("fat").asDouble());

            return food;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch nutrition data from OpenRouter. Response: " + responseText, e);
        }
    }

    private String buildPrompt(String name, String desc, String portion) {
        return String.format(
                "Given the following food description with ingredients and portion size, " +
                        "provide the approximate nutritional values (calories, protein, carbs, fat) for one portion.\n" +
                        "Food Name: %s\n" +
                        "Description: %s\n" +
                        "Portion: %s\n" +
                        "Return only a valid JSON object. Do not wrap it in Markdown or add any explanation. " +
                        "Use this exact shape: { \"calories\": ..., \"protein\": ..., \"carbs\": ..., \"fat\": ... }",
                name, desc, portion);
    }

    private String extractJsonObject(String text) {
        int start = text.indexOf('{');
        int end = text.lastIndexOf('}');

        if (start == -1 || end == -1 || end < start) {
            throw new RuntimeException("AI response did not contain a JSON object.");
        }

        return text.substring(start, end + 1);
    }
}
