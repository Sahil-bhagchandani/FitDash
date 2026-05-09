package com.example.demo.Services;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;

import static org.assertj.core.api.Assertions.assertThat;

class OpenRouterNutritionServiceTest {

    @Test
    void extractJsonObjectHandlesMarkdownFencedJson() throws Exception {
        OpenRouterNutritionService service = new OpenRouterNutritionService("test-key", "openrouter/free");
        Method method = OpenRouterNutritionService.class.getDeclaredMethod("extractJsonObject", String.class);
        method.setAccessible(true);

        String result = (String) method.invoke(service, """
                ```json
                {
                  "calories": 370,
                  "protein": 6,
                  "carbs": 55,
                  "fat": 20
                }
                ```
                """);

        assertThat(result).contains("\"calories\": 370");
        assertThat(result).startsWith("{");
        assertThat(result).endsWith("}");
    }
}
