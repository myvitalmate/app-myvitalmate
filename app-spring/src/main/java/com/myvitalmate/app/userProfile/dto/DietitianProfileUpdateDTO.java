package com.myvitalmate.app.userProfile.dto;

import java.time.LocalDate;

public record DietitianProfileUpdateDTO(
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String specialty
) {
}
