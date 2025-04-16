package com.example.demo.Controllers;

import java.util.HashMap;
import java.util.Map;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Models.User;
import com.example.demo.Services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");
        return userService.loginUser(username, password)
                .<ResponseEntity<?>>map(user -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("userId", user.getId());
                    response.put("username", user.getUsername());
                    return ResponseEntity.ok(response);
                })

                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));

    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("/{username}/bmr-goal")
    public ResponseEntity<?> updateBmrGoal(
            @PathVariable String username,
            @RequestBody Map<String, Object> goalData) {
        try {
            userService.updateBmrGoal(username, goalData);
            return ResponseEntity.ok("BMR and Goal updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{username}/basic-info")
    public ResponseEntity<?> getBasicUserInfo(@PathVariable String username) {
        Optional<User> userOpt = userService.getUserByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> info = new HashMap<>();
            info.put("age", user.getAge());
            info.put("weight", user.getWeight());
            info.put("height", user.getHeight());
            info.put("gender", user.getGender());
            info.put("username", user.getUsername());

            // Calculate BMI
            double bmi = userService.calculateBMI(user);
            info.put("bmi", bmi);

            return ResponseEntity.ok(info);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

}
