package com.myvitalmate.app.nutrientLog.repository;

import com.myvitalmate.app.nutrientLog.entity.NutrientEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface NutrientEntryRepository extends JpaRepository<NutrientEntryEntity, Long> {

    @Query("SELECT n.name, SUM(n.amount) as total, MAX(n.unit) as unit FROM NutrientEntryEntity n " +
            "JOIN n.foodEntry f " +
            "JOIN f.nutrientLog l " +
            "WHERE n.name IN :nutrientNames " +
            "AND l.patient.id = :patientId " +
            "AND l.logDate BETWEEN :startDate AND :endDate " +
            "GROUP BY n.name")
    List<Object[]> sumMultipleNutrientsByDateRange(List<String> nutrientNames, Long patientId,
                                                   LocalDate startDate, LocalDate endDate);
}
