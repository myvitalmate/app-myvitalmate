package com.myvitalmate.app.nutrientLog.entity;


import com.myvitalmate.app.userProfile.entity.PatientProfile;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class NutrientLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate logDate;

    @ManyToOne(fetch = FetchType.LAZY)
    private PatientProfile patient;

    @OneToMany(mappedBy = "nutrientLog", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodEntryEntity> foodEntries = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public PatientProfile getPatient() {
        return patient;
    }

    public void setPatient(PatientProfile patient) {
        this.patient = patient;
    }

    public List<FoodEntryEntity> getFoodEntries() {
        return foodEntries;
    }

    public void setFoodEntries(List<FoodEntryEntity> foodEntries) {
        this.foodEntries = foodEntries;
    }

    public void addFoodEntry(FoodEntryEntity foodEntry) {
        foodEntries.add(foodEntry);
        foodEntry.setNutrientLog(this);
    }

    public void removeFoodEntry(FoodEntryEntity foodEntry) {
        foodEntries.remove(foodEntry);
        foodEntry.setNutrientLog(null);
    }
}
