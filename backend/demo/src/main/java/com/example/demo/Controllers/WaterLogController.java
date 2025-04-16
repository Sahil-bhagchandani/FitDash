package com.example.demo.Controllers;

import com.example.demo.Models.WaterLogs;
import com.example.demo.Services.WaterLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/waterlog")
@CrossOrigin
public class WaterLogController {

    @Autowired
    private WaterLogService waterLogService;

    @PostMapping("/add")
    public WaterLogs logWater(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        double amount = Double.parseDouble(body.get("amount").toString());
        return waterLogService.logWater(username, amount);
    }

    @GetMapping("/total/{username}/{date}")
    public double getTotalWaterIntakeByDate(@PathVariable String username, @PathVariable String date) {
        return waterLogService.getTotalWaterIntakeByUsernameAndDate(username, date);
    }

}
