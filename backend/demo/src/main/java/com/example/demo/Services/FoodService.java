package com.example.demo.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.Models.CustomFoodRequest;
import com.example.demo.Models.Foods;
import com.example.demo.Models.User;
import com.example.demo.Models.UserLogs;
import com.example.demo.Repositories.FoodRepository;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;

import java.util.Optional;
@Service
public class FoodService {

    @Autowired
    private OpenRouterNutritionService AiService;

    @Autowired
    private FoodRepository foodRepo;

    @Autowired
    private UserLogRepository logRepo;

    @Autowired
    private UserRepository userRepo;

    public void handleCustomFoodEntry(CustomFoodRequest request) {
        // Step 1: Generate nutrition info from AI
        Foods food = AiService.getNutritionDataFromAI(
                request.getName(),
                request.getDescription(),
                request.getPortion()
        );

        System.out.println("Food before saving: " + food);
        // Step 2: Save food to DB
        foodRepo.save(food);
        // Step 3: Create user log
        Optional<User> userOpt = userRepo.findById(request.getUserId());
        if (userOpt.isEmpty()) throw new RuntimeException("User not found");

        UserLogs log = new UserLogs();
        log.setUserId(userOpt.get().getId());
        log.setFoodName(food.getName());
        log.setPortion(request.getPortion());
        log.setCalories(food.getCalories());
        log.setProtein(food.getProtein());
        log.setCarbs(food.getCarbs());
        log.setFat(food.getFat());
        log.setLoggedAt(LocalDateTime.now());
        log.setDate(LocalDate.now().toString());
        log.setCategory(request.getCategory());
        System.out.println("Log before saving: " + log);

        logRepo.save(log);

    }
}

