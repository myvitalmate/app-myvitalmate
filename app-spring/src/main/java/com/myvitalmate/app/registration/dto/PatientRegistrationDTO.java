package com.myvitalmate.app.registration.dto;

import java.time.LocalDate;

public record PatientRegistrationDTO(
        NameDTO name,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String dietOrientation,
        String currentWeight,
        String goals,
        String photoUrl, //TODO delete implement image upload base64 or blob?
        String sickness
) {
}
