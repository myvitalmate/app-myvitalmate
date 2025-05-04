package com.myvitalmate.app.dietProtocol.entity;

import jakarta.persistence.*;


public class NutritionEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nutrientName;
    private double amount;
    private String unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutrition_entry_id")
    private NutritionEntry nutritionEntry;
}
