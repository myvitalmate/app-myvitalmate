package com.myvitalmate.app.userProfile.dto;

import java.util.Optional;

public record DietitianProfileUpdateDTO(
        Optional<String> lastName,
        Optional<AdresseDTO> adresse,
        Optional<ContactDTO> contact,
        Optional<String> specialty
) {
}
