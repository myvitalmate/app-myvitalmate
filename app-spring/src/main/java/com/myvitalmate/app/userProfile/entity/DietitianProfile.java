package com.myvitalmate.app.userProfile.entity;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import jakarta.persistence.*;

@Entity
@Table(name = "Dietitian")
public class DietitianProfile extends Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialty;

    public DietitianProfile() {
        // JPA requires a no-arg constructor
    }

    public DietitianProfile(DietitianProfileDTO dto) {
        super(new Name(dto.firstName(), dto.lastName()),
                new Adresse(dto.adresse()),
                new Contact(dto.contact()),
                dto.birthday(),
                dto.gender());
        this.specialty = dto.specialty();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }
}
