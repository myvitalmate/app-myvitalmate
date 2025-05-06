package com.myvitalmate.app.nutrientLog.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class FoodEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ingredientName;
    private int ingredientId;
    private double amount;
    private String unit;
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    private NutrientLogEntity nutrientLog;

    @OneToMany(mappedBy = "foodEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NutrientEntryEntity> nutrients = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public int getIngredientId() {
        return ingredientId;
    }

    public void setIngredientId(int ingredientId) {
        this.ingredientId = ingredientId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public NutrientLogEntity getNutrientLog() {
        return nutrientLog;
    }

    public void setNutrientLog(NutrientLogEntity nutrientLog) {
        this.nutrientLog = nutrientLog;
    }

    public List<NutrientEntryEntity> getNutrients() {
        return nutrients;
    }

    public void setNutrients(List<NutrientEntryEntity> nutrients) {
        this.nutrients = nutrients;
    }

    public void addNutrient(NutrientEntryEntity nutrient) {
        nutrients.add(nutrient);
        nutrient.setFoodEntry(this);
    }

    public void removeNutrient(NutrientEntryEntity nutrient) {
        nutrients.remove(nutrient);
        nutrient.setFoodEntry(null);
    }
}
