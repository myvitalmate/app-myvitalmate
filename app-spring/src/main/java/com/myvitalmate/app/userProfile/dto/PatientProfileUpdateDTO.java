package com.myvitalmate.app.userProfile.dto;

import java.util.Optional;

public record PatientProfileUpdateDTO(
        Optional<String> lastName,
        Optional<AdresseDTO> adresse,
        Optional<ContactDTO> contact,
        Optional<String> dietOrientation,
        Optional<String> currentWeight,
        Optional<String> sickness,
        Optional<String> goals
) {
}