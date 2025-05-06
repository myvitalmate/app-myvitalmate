package com.myvitalmate.app.nutrientLog.repository;

import com.myvitalmate.app.nutrientLog.entity.NutrientEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NutrientEntryRepository extends JpaRepository<NutrientEntryEntity, Long> {
    List<NutrientEntryEntity> findByFoodEntryId(Long foodEntryId);
}
