package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "Dietitian")
public class DietitianProfile extends Profile {

    private String specialty;

    public DietitianProfile() {
        // JPA requires a no-arg constructor
    }

    public DietitianProfile(DietitianProfileDTO dto) {
        super(dto.firstName(),
                dto.lastName(),
                new Adresse(dto.adresse()),
                new Contact(dto.contact()),
                dto.birthday(),
                dto.gender());
        this.specialty = dto.specialty();
    }


    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
}
