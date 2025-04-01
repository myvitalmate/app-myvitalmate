package com.myvitalmate.app.registration.dto;

import java.time.LocalDate;

public record PatientResponseDTO(
        Long id,
        NameDTO name,
        ContactDTO contact,
        AdresseDTO adresse,
        String status,
        LocalDate birthday,
        String dietOrientation,
        String currentWeight,
        String goals,
        String photoUrl,
        String sickness
) {
}