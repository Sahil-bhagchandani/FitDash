package com.example.demo.Models;

public class CustomFoodRequest {
    private String userId;
    private String name;
    private String description; // ingredient-quantity format
    private String portion;
    private String category;
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    // getters and setters
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getPortion() {
        return portion;
    }
    public void setPortion(String portion) {
        this.portion = portion;
    }
    
    
    
}

