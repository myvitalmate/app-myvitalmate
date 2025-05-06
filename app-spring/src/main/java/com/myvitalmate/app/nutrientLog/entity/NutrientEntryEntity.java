package com.myvitalmate.app.nutrientLog.entity;

import jakarta.persistence.*;

@Entity
public class NutrientEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double amount;
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    private FoodEntryEntity foodEntry;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public FoodEntryEntity getFoodEntry() {
        return foodEntry;
    }

    public void setFoodEntry(FoodEntryEntity foodEntry) {
        this.foodEntry = foodEntry;
    }
}
