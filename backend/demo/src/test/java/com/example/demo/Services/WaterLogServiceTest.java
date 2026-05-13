package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Models.WaterLogs;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Repositories.WaterLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WaterLogServiceTest {

    @Mock
    private WaterLogRepository waterLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WaterLogService waterLogService;

    @Test
    void logWaterSavesAmountForUser() {
        User user = new User();
        user.setId("user-1");
        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));

        waterLogService.logWater("sahil", 250);

        ArgumentCaptor<WaterLogs> captor = ArgumentCaptor.forClass(WaterLogs.class);
        verify(waterLogRepository).save(captor.capture());

        WaterLogs savedLog = captor.getValue();
        assertThat(savedLog.getUserId()).isEqualTo("user-1");
        assertThat(savedLog.getAmount()).isEqualTo(250);
        assertThat(savedLog.getDate()).isNotBlank();
    }

    @Test
    void getTotalWaterIntakeByUsernameAndDateSumsLogs() {
        User user = new User();
        user.setId("user-1");

        WaterLogs first = waterLog(250);
        WaterLogs second = waterLog(500);

        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));
        when(waterLogRepository.findByUserIdAndDate("user-1", "2026-05-09"))
                .thenReturn(List.of(first, second));

        double total = waterLogService.getTotalWaterIntakeByUsernameAndDate("sahil", "2026-05-09");

        assertThat(total).isEqualTo(750);
    }

    @Test
    void removeWaterDeletesOneMatchingLogForDate() {
        User user = new User();
        user.setId("user-1");

        WaterLogs olderGlass = waterLog(250);
        WaterLogs latestGlass = waterLog(250);

        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));
        when(waterLogRepository.findByUserIdAndDate("user-1", "2026-05-13"))
                .thenReturn(List.of(olderGlass, latestGlass));

        boolean removed = waterLogService.removeWater("sahil", 250, "2026-05-13");

        assertThat(removed).isTrue();
        verify(waterLogRepository).delete(latestGlass);
        verify(waterLogRepository, never()).delete(olderGlass);
    }

    @Test
    void removeWaterReturnsFalseWhenNoMatchingLogExists() {
        User user = new User();
        user.setId("user-1");

        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));
        when(waterLogRepository.findByUserIdAndDate("user-1", "2026-05-13"))
                .thenReturn(List.of(waterLog(500)));

        boolean removed = waterLogService.removeWater("sahil", 250, "2026-05-13");

        assertThat(removed).isFalse();
    }

    private WaterLogs waterLog(double amount) {
        WaterLogs log = new WaterLogs();
        log.setAmount(amount);
        return log;
    }
}
