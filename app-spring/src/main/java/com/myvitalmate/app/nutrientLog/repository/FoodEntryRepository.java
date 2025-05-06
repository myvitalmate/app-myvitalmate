package com.myvitalmate.app.nutrientLog.repository;

import com.myvitalmate.app.nutrientLog.entity.FoodEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodEntryRepository extends JpaRepository<FoodEntryEntity, Long> {
    List<FoodEntryEntity> findByNutrientLogId(Long nutrientLogId);
}
