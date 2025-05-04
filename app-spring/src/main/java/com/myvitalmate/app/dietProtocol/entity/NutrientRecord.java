package com.myvitalmate.app.dietProtocol.entity;

import com.myvitalmate.app.userProfile.entity.Profile;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


public class NutrientRecord {
    @OneToMany(mappedBy = "nutritionEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private final List<NutrientRecord> nutrients = new ArrayList<>();
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate date;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;
    private String mealType;
    private String notes;
}
