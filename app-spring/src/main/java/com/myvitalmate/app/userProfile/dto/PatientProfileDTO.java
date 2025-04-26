package com.myvitalmate.app.userProfile.dto;


import com.myvitalmate.app.userProfile.entity.PatientProfile;

import java.time.LocalDate;

public record PatientProfileDTO(
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String dietOrientation,
        String currentWeight,
        String goals,
        String sickness
) {
    public static PatientProfileDTO fromEntity(PatientProfile entity) {
        return new PatientProfileDTO(
                entity.getFirstName(),
                entity.getLastName(),
                new ContactDTO(entity.getContact().getEmail(), entity.getContact().getPhoneNumber()),
                new AdresseDTO(
                        entity.getAdresse().getStreet(),
                        entity.getAdresse().getCity(),
                        entity.getAdresse().getCountry(),
                        entity.getAdresse().getPostalCode()
                ),
                entity.getGender(),
                entity.getBirthday(),
                entity.getDietOrientation(),
                entity.getCurrentWeight(),
                entity.getGoals(),
                entity.getSickness()
        );
    }

}
