package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Models.UserLogs;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserLogServiceTest {

    @Mock
    private UserLogRepository userLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserLogService userLogService;

    @Test
    void getMacroSummarySumsLogsForDate() {
        User user = new User();
        user.setId("user-1");

        UserLogs breakfast = log(300, 20, 35, 8);
        UserLogs lunch = log(500, 30, 50, 16);

        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));
        when(userLogRepository.findByUserIdAndDate("user-1", "2026-05-09"))
                .thenReturn(List.of(breakfast, lunch));

        Map<String, Double> summary = userLogService.getMacroSummaryByUsernameAndDate("sahil", "2026-05-09");

        assertThat(summary).containsEntry("calories", 800.0);
        assertThat(summary).containsEntry("protein", 50.0);
        assertThat(summary).containsEntry("carbs", 85.0);
        assertThat(summary).containsEntry("fat", 24.0);
    }

    @Test
    void getLogsByUsernameAndDateReturnsEmptyListForMissingUser() {
        when(userRepository.findByUsername("missing")).thenReturn(Optional.empty());

        List<UserLogs> logs = userLogService.getLogsByUsernameAndDate("missing", "2026-05-09");

        assertThat(logs).isEmpty();
    }

    private UserLogs log(double calories, double protein, double carbs, double fat) {
        UserLogs log = new UserLogs();
        log.setCalories(calories);
        log.setProtein(protein);
        log.setCarbs(carbs);
        log.setFat(fat);
        return log;
    }
}
