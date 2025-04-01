package com.myvitalmate.app.registration.dto;

public record PatientUpdateDTO(
        NameDTO name,
        ContactDTO contact,
        AdresseDTO adresse,
        String status,
        String dietOrientation,
        String currentWeight,
        String goals,
        String sickness,
        String photoUrl
) {
}
