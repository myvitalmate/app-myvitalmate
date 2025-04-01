package com.myvitalmate.app.registration.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "Dietitian")
public class DietitianProfile extends Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialty;

    public DietitianProfile(Name name, Contact contact, Adresse adresse,
                            LocalDate birthday, String gender, String photoUrl,
                            String specialty) {
        super(name, adresse, contact, birthday, gender, photoUrl);

        this.specialty = specialty;
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
