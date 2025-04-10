package com.myvitalmate.app.userProfile.dto;

import java.time.LocalDate;

public record DietitianRegistrationDTO(
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String specialty
) {
}
