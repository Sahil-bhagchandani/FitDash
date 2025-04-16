package com.example.demo.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Models.Foods;

import java.util.List;

@Repository
public interface FoodRepository extends MongoRepository<Foods, String> {
    List<Foods> findByNameContainingIgnoreCase(String name);
    Foods findByNameIgnoreCase(String name); // Optional if you want exact match
}
