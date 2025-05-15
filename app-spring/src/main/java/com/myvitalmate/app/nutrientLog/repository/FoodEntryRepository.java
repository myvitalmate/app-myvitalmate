package com.myvitalmate.app.nutrientLog.repository;

import com.myvitalmate.app.nutrientLog.entity.FoodEntryEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodEntryRepository extends JpaRepository<FoodEntryEntity, Long> {
    List<FoodEntryEntity> findByNutrientLog_Patient_IdOrderByTimestampDesc(Long patientId, Pageable pageable);
}
