package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.PatientRegistrationDTO;
import jakarta.persistence.*;

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

    public PatientProfile(PatientRegistrationDTO dto) {
        Name name = new Name(dto.name().firstName(), dto.name().lastName());
        Contact contact = new Contact(dto.contact().phoneNumber(), dto.contact().email());
        Adresse adresse = new Adresse(dto.adresse().street(), dto.adresse().city(), dto.adresse().postalCode(), dto.adresse().country());
        super(name, adresse, contact, dto.birthday(), dto.gender(), dto.photoUrl());
        this.dietOrientation = dto.dietOrientation();
        this.currentWeight = dto.currentWeight();
        this.goals = dto.goals();
        this.sickness = dto.sickness();
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
