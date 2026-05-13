package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Models.WaterLogs;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Repositories.WaterLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class WaterLogService {

    @Autowired
    private WaterLogRepository waterLogRepository;

    @Autowired
    private UserRepository userRepository;

    public WaterLogs logWater(String username, double amount) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) return null;

        WaterLogs log = new WaterLogs();
        log.setUserId(optionalUser.get().getId());
        log.setAmount(amount);
        log.setDate(LocalDate.now().toString());

        return waterLogRepository.save(log);
    }

    public boolean removeWater(String username, double amount) {
        return removeWater(username, amount, LocalDate.now().toString());
    }

    boolean removeWater(String username, double amount, String date) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) return false;

        String userId = optionalUser.get().getId();
        List<WaterLogs> logs = waterLogRepository.findByUserIdAndDate(userId, date);

        for (int i = logs.size() - 1; i >= 0; i--) {
            WaterLogs log = logs.get(i);
            if (Math.abs(log.getAmount() - amount) < 0.001) {
                waterLogRepository.delete(log);
                return true;
            }
        }

        return false;
    }

    public List<WaterLogs> getWaterLogsByUsername(String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) return null;

        return waterLogRepository.findByUserId(optionalUser.get().getId());
    }

    public double getTotalWaterIntakeByUsernameAndDate(String username, String date) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (!optionalUser.isPresent()) return 0;

        String userId = optionalUser.get().getId();
        List<WaterLogs> logs = waterLogRepository.findByUserIdAndDate(userId, date);

        // Calculate the total amount of water consumed on that day
        return logs.stream()
                   .mapToDouble(WaterLogs::getAmount)
                   .sum();  // This sums all the amounts for that particular date
    }
}
