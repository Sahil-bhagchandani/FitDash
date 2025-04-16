package com.example.demo.Models;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_logs")
public class UserLogs {

    @Id
    private String id;
    private String userId; // Reference to the user
    private String foodName; // Duplicate for quick lookup
    private String portion; // User’s actual portion
    private double calories;
    private double protein;
    private double carbs;
    private double fat;
    private LocalDateTime loggedAt; // Timestamp of when the log was created
    private String date; // New field to store the date (without time) for easier date-based filtering
    private String category; // Category for meal type (e.g., breakfast, lunch, dinner, snack)

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getPortion() {
        return portion;
    }

    public void setPortion(String portion) {
        this.portion = portion;
    }

    public double getCalories() {
        return calories;
    }

    public void setCalories(double calories) {
        this.calories = calories;
    }

    public double getProtein() {
        return protein;
    }

    public void setProtein(double protein) {
        this.protein = protein;
    }

    public double getCarbs() {
        return carbs;
    }

    public void setCarbs(double carbs) {
        this.carbs = carbs;
    }

    public double getFat() {
        return fat;
    }

    public void setFat(double fat) {
        this.fat = fat;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }

    public String getDate() {
        return date;
    }

    public void  setDate(String date) {
        this.date = date;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "UserLogs{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", foodName='" + foodName + '\'' +
                ", portion='" + portion + '\'' +
                ", calories=" + calories +
                ", protein=" + protein +
                ", carbs=" + carbs +
                ", fat=" + fat +
                ", loggedAt=" + loggedAt +
                ", date=" + date +
                ", category='" + category + '\'' +
                '}';
    }
}
