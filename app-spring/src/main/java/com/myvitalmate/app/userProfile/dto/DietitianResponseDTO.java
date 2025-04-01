package com.myvitalmate.app.userProfile.dto;

import java.time.LocalDate;

public record DietitianResponseDTO(
        Long id,
        NameDTO name,
        ContactDTO contact,
        String specialty,
        String status,
        String photoUrl,
        LocalDate birthday
) {
}