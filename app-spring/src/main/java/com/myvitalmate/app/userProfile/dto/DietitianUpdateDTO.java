package com.myvitalmate.app.userProfile.dto;

public record DietitianUpdateDTO(
        NameDTO name,
        ContactDTO contact,
        AdresseDTO adresse,
        String status,
        String specialty,
        String photoUrl
) {
}
