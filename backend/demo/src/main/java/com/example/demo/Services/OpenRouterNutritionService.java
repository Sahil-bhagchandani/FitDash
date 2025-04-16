package com.example.demo.Services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.Models.Foods;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class OpenRouterNutritionService {

    private final String apiKey;

    public OpenRouterNutritionService(@Value("${openrouter.api.key}") String apiKey) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalArgumentException("OpenRouter API key is missing. Please set 'openrouter.api.key' in application.properties.");
        }
        this.apiKey = apiKey;
    }

    public Foods getNutritionDataFromAI(String name, String description, String portion) {
        String prompt = buildPrompt(name, description, portion);
        String responseText = null;

        try {
            String uuid = UUID.randomUUID().toString();

            // Escape special characters in prompt
            String escapedPrompt = prompt.replace("\n", "\\n").replace("\"", "\\\"");

            // ✅ Construct Request Body (with temperature and user ID)
            String requestBody = String.format("{\n" +
                "  \"model\": \"openai/gpt-3.5-turbo\",\n" +
                "  \"temperature\": 0,\n" +
                "  \"messages\": [\n" +
                "    {\"role\": \"user\", \"content\": \"%s\"}\n" +
                "  ],\n" +
                "  \"user\": \"%s\"\n" +
                "}", escapedPrompt, uuid);

            // ✅ Print request for debugging
            System.out.println("📤 Request Body:");
            System.out.println(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://openrouter.ai/api/v1/chat/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("📥 OpenRouter API Raw Response:");
            System.out.println(response.body());

            if (response.statusCode() != 200) {
                System.err.println("❌ HTTP error code: " + response.statusCode());
                throw new RuntimeException("OpenRouter API failed with status: " + response.statusCode());
            }

            // ✅ Parse JSON response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            JsonNode choicesNode = root.path("choices");
            if (!choicesNode.isArray() || choicesNode.size() == 0) {
                System.err.println("❌ No choices found in response.");
                throw new RuntimeException("Invalid response format: 'choices' array missing or empty.");
            }

            JsonNode messageNode = choicesNode.get(0).path("message");
            if (messageNode.isMissingNode()) {
                System.err.println("❌ 'message' field missing.");
                throw new RuntimeException("Invalid response: 'message' not found.");
            }

            responseText = messageNode.path("content").asText();
            System.out.println("📦 Extracted Content:");
            System.out.println(responseText);

            // ✅ Parse nutrition JSON
            JsonNode nutritionNode = mapper.readTree(responseText);
            if (!nutritionNode.has("calories") || !nutritionNode.has("protein") || !nutritionNode.has("carbs") || !nutritionNode.has("fat")) {
                System.err.println("❌ Missing nutrition fields in response content.");
                throw new RuntimeException("Incomplete nutrition data in response.");
            }

            // ✅ Create and return Foods object
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
            System.err.println("❌ Exception occurred while fetching nutrition data:");
            System.err.println("Prompt:\n" + prompt);
            System.err.println("Response (if any):\n" + responseText);
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch nutrition data from OpenRouter", e);
        }
    }

    private String buildPrompt(String name, String desc, String portion) {
        return String.format(
            "Given the following food description with ingredients and portion size, " +
            "provide the approximate nutritional values (calories, protein, carbs, fat) for one portion.\n" +
            "Food Name: %s\n" +
            "Description: %s\n" +
            "Portion: %s\n" +
            "Return the output as JSON with only numbers (no units) like: " +
            "{ \"calories\": ..., \"protein\": ..., \"carbs\": ..., \"fat\": ... }", 
            name, desc, portion);
    }
}
