package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Patient")
public class PatientProfile extends Profile {

    private String dietOrientation;
    private String currentWeight;
    private String goals;
    private String sickness;

    public PatientProfile() {
        // JPA requires a no-arg constructor
    }

    public PatientProfile(PatientProfileDTO dto) {
        super(dto.firstName(),
                dto.lastName(),
                new Adresse(dto.adresse()),
                new Contact(dto.contact()),
                dto.birthday(),
                dto.gender());
        this.dietOrientation = dto.dietOrientation();
        this.currentWeight = dto.currentWeight();
        this.goals = dto.goals();
        this.sickness = dto.sickness();
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
