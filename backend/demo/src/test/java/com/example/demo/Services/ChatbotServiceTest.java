package com.example.demo.Services;

import com.example.demo.Models.UserLogs;
import com.example.demo.Models.WaterLogs;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;
import com.example.demo.Repositories.WaterLogRepository;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

class ChatbotServiceTest {

    @Test
    void buildContextClearlyScopesLogsToOneDate() {
        ChatbotService service = new ChatbotService(
                "test-key",
                "openrouter/free",
                mock(UserRepository.class),
                mock(UserLogRepository.class),
                mock(WaterLogRepository.class)
        );

        UserLogs poha = new UserLogs();
        poha.setFoodName("Poha");
        poha.setPortion("1 plate");
        poha.setCalories(280);
        poha.setProtein(6);
        poha.setCarbs(45);
        poha.setFat(8);

        WaterLogs water = new WaterLogs();
        water.setDate("2026-05-13");
        water.setAmount(750);

        String context = service.buildContext("2026-05-13", List.of(poha), List.of(water));

        assertThat(context).contains("2026-05-13 only");
        assertThat(context).contains("Do not count food or water from any other date");
        assertThat(context).contains("Poha (1 plate): 280.0 cal");
        assertThat(context).doesNotContain("today");
    }

    @Test
    void buildContextHandlesEmptyDailyLogs() {
        ChatbotService service = new ChatbotService(
                "test-key",
                "openrouter/free",
                mock(UserRepository.class),
                mock(UserLogRepository.class),
                mock(WaterLogRepository.class)
        );

        String context = service.buildContext("2026-05-13", List.of(), List.of());

        assertThat(context).contains("No food logged for this date.");
        assertThat(context).contains("No water logged for this date.");
    }
}
