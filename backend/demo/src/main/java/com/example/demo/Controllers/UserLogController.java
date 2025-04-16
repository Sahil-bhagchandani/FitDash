package com.example.demo.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Models.UserLogs;
import com.example.demo.Services.UserLogService;

@RestController
@RequestMapping("/api/userlog")
public class UserLogController {

    @Autowired
    private UserLogService userLogService;

    @GetMapping("/by-username/{username}")
    public List<UserLogs> getUserLogsByUsername(@PathVariable String username) {
        return userLogService.getLogsByUsername(username);
    }

    @GetMapping("/total/{username}/{date}")
    public double getTotalCalories(@PathVariable String username, @PathVariable String date) {
        return userLogService.getTotalCaloriesByUsernameAndDate(username, date);
    }

    @GetMapping("by-name-date/{username}/{date}")
    public List<UserLogs> getUserLogsByDate(@PathVariable String username, @PathVariable String date) {
        return userLogService.getLogsByUsernameAndDate(username, date);
    }

    @GetMapping("/macro-summary/{username}/{date}")
    public Map<String, Double> getMacroSummary(
            @PathVariable String username,
            @PathVariable String date) {
        return userLogService.getMacroSummaryByUsernameAndDate(username, date);
    }

}
