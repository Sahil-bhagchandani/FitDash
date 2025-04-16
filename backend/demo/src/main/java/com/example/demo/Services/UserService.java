package com.example.demo.Services;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Models.User;
import com.example.demo.Repositories.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password));
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // 🔥 New method to update BMR goal
    public void updateBmrGoal(String username, Map<String, Object> goalData) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String goal = user.getGoal();
            String exerciseLevel = (String) goalData.get("exerciseLevel");
            Double targetWeight = Double.valueOf(goalData.get("targetWeight").toString());
            Double perWeekChange = Double.valueOf(goalData.get("weeklyChange").toString());
            double bmr = calculateBMR(user);
            double maintenance = adjustForActivityLevel(bmr, exerciseLevel);
            double calorieGoal = adjustForGoal(maintenance, goal, perWeekChange);

            user.setBmr(bmr); // Store final calorie goal
            user.setGoal(goal);
            user.setExerciseLevel(exerciseLevel);
            user.setTargetWeight(targetWeight);
            user.setDailyCalories(calorieGoal);

            double waterGoal = calculateWaterGoal(user.getWeight(), exerciseLevel);
            user.setWaterGoal(waterGoal);

            userRepository.save(user);
        }
    }

    // 🔢 BMR Calculation (Mifflin-St Jeor Equation)
    private double calculateBMR(User user) {
        double weight = user.getWeight(); // in kg
        double height = user.getHeight(); // in cm
        double age = user.getAge();
        String gender = user.getGender().toLowerCase();

        if (gender.equals("male")) {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    // 🏋️ Adjust for Activity Level
    private double adjustForActivityLevel(double bmr, String level) {
        switch (level.toLowerCase()) {
            case "light":
                return bmr * 1.375;
            case "moderate":
                return bmr * 1.55;
            case "active":
                return bmr * 1.725;
            case "very active":
                return bmr * 1.9;
            case "sedentary":
                return bmr * 1.2;
            default:
                return bmr;// sedentary
        }
    }

    // 🎯 Adjust Calorie Goal Based on Goal Type
    private double adjustForGoal(double maintenance, String goal, double perWeekChange) {
        double deficitOrSurplus = 0;

        if (goal.equalsIgnoreCase("loose")|| goal.equalsIgnoreCase("loose weight")) {
            if (perWeekChange <= 0.25) {
                deficitOrSurplus = 200;
            } else {
                deficitOrSurplus = 400;
            }
            return maintenance - deficitOrSurplus;
        } else if (goal.equalsIgnoreCase("gain") || goal.equalsIgnoreCase("gain weight")) {
            if (perWeekChange <= 0.25) {
                deficitOrSurplus = 200;
            } else {
                deficitOrSurplus = 400;
            }
            return maintenance + deficitOrSurplus;
        }

        return maintenance; // Maintain
    }

    public double calculateBMI(User user) {
        // BMI = weight (kg) / height (m)²
        double heightInMeters = user.getHeight() / 100; // Convert height to meters
        double bmi = user.getWeight() / (heightInMeters * heightInMeters);

        // Round to 1 decimal place
        return Math.round(bmi * 10.0) / 10.0;
    }

    private double calculateWaterGoal(double weight, String exerciseLevel) {
        double baseWater = weight * 0.033;
        double adjustment = 0;
    
        switch (exerciseLevel.toLowerCase()) {
            case "light":
                adjustment = 0.3;
                break;
            case "moderate":
                adjustment = 0.5;
                break;
            case "active":
                adjustment = 0.7;
                break;
            case "very active":
                adjustment = 1.0;
                break;
            case "sedentary":
            default:
                adjustment = 0.0;
                break;
        }
    
        double totalWater = baseWater + adjustment;
        return Math.round(totalWater * 100.0) / 100.0; // Round to 2 decimal places
    }
    

}
