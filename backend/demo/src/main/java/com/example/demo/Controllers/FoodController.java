package com.example.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Models.CustomFoodRequest;
import com.example.demo.Services.FoodService;

@RestController
@RequestMapping("/api/food")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping("/custom-entry")
    public ResponseEntity<String> addCustomFood(@RequestBody CustomFoodRequest request) {
        try {
            foodService.handleCustomFoodEntry(request);
            return ResponseEntity.ok("Custom food entry saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to process entry: " + e.getMessage());
        }
    }
}

    

