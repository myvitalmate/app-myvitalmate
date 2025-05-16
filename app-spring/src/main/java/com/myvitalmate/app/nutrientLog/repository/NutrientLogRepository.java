package com.myvitalmate.app.nutrientLog.repository;

import com.myvitalmate.app.nutrientLog.entity.NutrientLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface NutrientLogRepository extends JpaRepository<NutrientLogEntity, Long> {
    Optional<NutrientLogEntity> findByPatientIdAndLogDate(Long patientId, LocalDate logDate);

    void deleteByPatientId(Long patientId);
}