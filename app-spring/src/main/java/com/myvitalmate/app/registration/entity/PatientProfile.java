package com.myvitalmate.app.registration.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Patient")
public class PatientProfile extends Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String dietOrientation;
    private String currentWeight;
    private String goals;
    private String sickness;

    public PatientProfile(Name name, Contact contact, Adresse adresse,
                          LocalDate birthday, String gender, String photoUrl,
                          String dietOrientation, String currentWeight, String goals, String sickness) {
        super(name, adresse, contact, birthday, gender, photoUrl);
        this.dietOrientation = dietOrientation;
        this.currentWeight = currentWeight;
        this.goals = goals;
        this.sickness = sickness;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDietOrientation() {
        return dietOrientation;
    }

    public void setDietOrientation(String dietOrientation) {
        this.dietOrientation = dietOrientation;
    }

    public String getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(String currentWeight) {
        this.currentWeight = currentWeight;
    }

    public String getGoals() {
        return goals;
    }

    public void setGoals(String goals) {
        this.goals = goals;
    }

    public String getSickness() {
        return sickness;
    }

    public void setSickness(String sickness) {
        this.sickness = sickness;
    }
}
