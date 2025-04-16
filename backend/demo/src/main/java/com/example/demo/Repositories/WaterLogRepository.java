package com.example.demo.Repositories;

import com.example.demo.Models.WaterLogs;
import org.springframework.data.mongodb.repository.MongoRepository;


import java.util.List;

public interface WaterLogRepository extends MongoRepository<WaterLogs, String> {
    List<WaterLogs> findByUserId(String userId);
    List<WaterLogs> findByUserIdAndDate(String userId, String date);
}
