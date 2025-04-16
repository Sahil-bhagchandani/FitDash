package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Models.UserLogs;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserLogService {

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserLogs> getLogsByUsername(String username) {
        Optional<User> optionaluser = userRepository.findByUsername(username);
        if (optionaluser == null) return null;

        String userId = optionaluser.get().getId();
        return userLogRepository.findByUserId(userId);
    }
    
    public double getTotalCaloriesByUsernameAndDate(String username, String date) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) return 0;

        String userId = optionalUser.get().getId();
        List<UserLogs> logs = userLogRepository.findByUserIdAndDate(userId, date);

        // Sum up the calories for the specified date
        return logs.stream()
                   .mapToDouble(UserLogs::getCalories)
                   .sum();
    }
    public Map<String, Double> getMacroSummaryByUsernameAndDate(String username, String date) {
    Optional<User> optionalUser = userRepository.findByUsername(username);
    if (!optionalUser.isPresent()) return Map.of();

    String userId = optionalUser.get().getId();
    List<UserLogs> logs = userLogRepository.findByUserIdAndDate(userId, date);

    double calories = 0, protein = 0, carbs = 0, fat = 0;

    for (UserLogs log : logs) {
        calories += log.getCalories();
        protein += log.getProtein();
        carbs += log.getCarbs();
        fat += log.getFat();
    }

    Map<String, Double> macroSummary = new HashMap<>();
    macroSummary.put("calories", calories);
    macroSummary.put("protein", protein);
    macroSummary.put("carbs", carbs);
    macroSummary.put("fat", fat);

    return macroSummary;
}

    public List<UserLogs> getLogsByUsernameAndDate(String username, String date) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent());

        String userId = optionalUser.get().getId();
        return userLogRepository.findByUserIdAndDate(userId, date);
    }
}
