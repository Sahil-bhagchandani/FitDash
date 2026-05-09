package com.example.demo.Services;

import com.example.demo.Models.User;
import com.example.demo.Repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void loginUserReturnsUserWhenPasswordMatches() {
        User user = new User();
        user.setUsername("sahil");
        user.setPassword("secret");
        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));

        Optional<User> result = userService.loginUser("sahil", "secret");

        assertThat(result).contains(user);
    }

    @Test
    void updateBmrGoalCalculatesCaloriesAndWaterGoal() {
        User user = new User();
        user.setUsername("sahil");
        user.setPassword("secret");
        user.setGender("male");
        user.setAge(22);
        user.setWeight(70);
        user.setHeight(175);
        user.setGoal("gain weight");

        when(userRepository.findByUsername("sahil")).thenReturn(Optional.of(user));

        userService.updateBmrGoal("sahil", Map.of(
                "exerciseLevel", "moderate",
                "targetWeight", 75,
                "weeklyChange", 0.5
        ));

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User savedUser = captor.getValue();

        assertThat(savedUser.getBmr()).isEqualTo(1688.75);
        assertThat(savedUser.getDailyCalories()).isEqualTo(3017.5625);
        assertThat(savedUser.getWaterGoal()).isEqualTo(2.81);
        assertThat(savedUser.getExerciseLevel()).isEqualTo("moderate");
        assertThat(savedUser.getTargetWeight()).isEqualTo(75);
    }

    @Test
    void calculateBMIRoundsToOneDecimalPlace() {
        User user = new User();
        user.setWeight(70);
        user.setHeight(175);

        assertThat(userService.calculateBMI(user)).isEqualTo(22.9);
    }
}
