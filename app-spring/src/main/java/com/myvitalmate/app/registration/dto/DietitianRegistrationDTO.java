package com.myvitalmate.app.registration.dto;

import java.time.LocalDate;

public record DietitianRegistrationDTO(
        NameDTO name,
        ContactDTO contact,
        AdresseDTO adresse,
        String specialty,
        String gender,
        String photoUrl,
        LocalDate birthday
) {
}
