package com.myvitalmate.app.userProfile.dto;

import java.time.LocalDate;

public record DietitianProfileDTO(
        Long id,
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String specialty
) {
}
