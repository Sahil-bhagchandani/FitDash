package com.example.demo.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Models.UserLogs;
import java.util.List;

@Repository
public interface UserLogRepository extends MongoRepository<UserLogs, String> {
    List<UserLogs> findByUserId(String userId);

    List<UserLogs> findByUserIdAndDate(String userId, String date);

    List<UserLogs> findByUserIdAndDateAndCategory(String userId, String date, String category);
}
