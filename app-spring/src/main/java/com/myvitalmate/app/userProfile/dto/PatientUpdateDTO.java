package com.myvitalmate.app.userProfile.dto;

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
