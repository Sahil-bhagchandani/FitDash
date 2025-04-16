package com.example.demo.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users") // MongoDB collection annotation
public class User {

    @Id
    private String id;  // MongoDB uses _id by default
    private String username;
    private String password;
    private double weight;
    private double height;
    private double age;
    private String gender;
    private String goal; // E.g., weight loss, maintenance, muscle gain
    private String email;

    private double bmr; // 🧮 Calorie goal after calculations
    private String exerciseLevel; // 🏋️ light, moderate, etc.
    private double targetWeight; // 🎯 User’s target weight
    private double dailyCalories;
    private double waterGoal;
    public double getWaterGoal() {
        return waterGoal;
    }
    public void setWaterGoal(double waterGoal) {
        this.waterGoal = waterGoal;
    }
    public double getDailyCalories() {
        return dailyCalories;
    }
    public void setDailyCalories(double dailyCalories) {
        this.dailyCalories = dailyCalories;
    }
    // Email
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    // ID
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    // Username & Password
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    // Body Info
    public double getWeight() {
        return weight;
    }
    public void setWeight(double weight) {
        this.weight = weight;
    }

    public double getHeight() {
        return height;
    }
    public void setHeight(double height) {
        this.height = height;
    }

    public double getAge() {
        return age;
    }
    public void setAge(double age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getGoal() {
        return goal;
    }
    public void setGoal(String goal) {
        this.goal = goal;
    }

    // 🔥 New Fields

    public double getBmr() {
        return bmr;
    }
    public void setBmr(double bmr) {
        this.bmr = bmr;
    }

    public String getExerciseLevel() {
        return exerciseLevel;
    }
    public void setExerciseLevel(String exerciseLevel) {
        this.exerciseLevel = exerciseLevel;
    }

    public double getTargetWeight() {
        return targetWeight;
    }
    public void setTargetWeight(double targetWeight) {
        this.targetWeight = targetWeight;
    }
}
