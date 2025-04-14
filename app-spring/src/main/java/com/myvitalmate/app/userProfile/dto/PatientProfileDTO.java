package com.myvitalmate.app.userProfile.dto;


import java.time.LocalDate;

public record PatientProfileDTO(
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String dietOrientation,
        String currentWeight,
        String goals,
        String sickness
) {
}
