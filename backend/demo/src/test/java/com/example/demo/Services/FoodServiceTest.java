package com.example.demo.Services;

import com.example.demo.Models.CustomFoodRequest;
import com.example.demo.Models.Foods;
import com.example.demo.Models.User;
import com.example.demo.Models.UserLogs;
import com.example.demo.Repositories.FoodRepository;
import com.example.demo.Repositories.UserLogRepository;
import com.example.demo.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FoodServiceTest {

    @Mock
    private OpenRouterNutritionService aiService;

    @Mock
    private FoodRepository foodRepo;

    @Mock
    private UserLogRepository logRepo;

    @Mock
    private UserRepository userRepo;

    @InjectMocks
    private FoodService foodService;

    @Test
    void handleCustomFoodEntrySavesFoodAndCreatesUserLog() {
        CustomFoodRequest request = new CustomFoodRequest();
        request.setUserId("user-1");
        request.setName("Paneer Bowl");
        request.setDescription("paneer 100g, rice 150g");
        request.setPortion("1 bowl");
        request.setCategory("lunch");

        Foods food = new Foods();
        food.setName("Paneer Bowl");
        food.setDescription("paneer 100g, rice 150g");
        food.setPortion("1 bowl");
        food.setCalories(520);
        food.setProtein(28);
        food.setCarbs(55);
        food.setFat(18);

        User user = new User();
        user.setId("user-1");

        when(aiService.getNutritionDataFromAI("Paneer Bowl", "paneer 100g, rice 150g", "1 bowl")).thenReturn(food);
        when(userRepo.findById("user-1")).thenReturn(Optional.of(user));

        foodService.handleCustomFoodEntry(request);

        verify(foodRepo).save(food);

        ArgumentCaptor<UserLogs> logCaptor = ArgumentCaptor.forClass(UserLogs.class);
        verify(logRepo).save(logCaptor.capture());
        UserLogs savedLog = logCaptor.getValue();

        assertThat(savedLog.getUserId()).isEqualTo("user-1");
        assertThat(savedLog.getFoodName()).isEqualTo("Paneer Bowl");
        assertThat(savedLog.getCalories()).isEqualTo(520);
        assertThat(savedLog.getProtein()).isEqualTo(28);
        assertThat(savedLog.getCarbs()).isEqualTo(55);
        assertThat(savedLog.getFat()).isEqualTo(18);
        assertThat(savedLog.getCategory()).isEqualTo("lunch");
        assertThat(savedLog.getDate()).isNotBlank();
        assertThat(savedLog.getLoggedAt()).isNotNull();
    }
}
