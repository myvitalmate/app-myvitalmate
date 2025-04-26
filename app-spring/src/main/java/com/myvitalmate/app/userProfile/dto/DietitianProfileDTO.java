package com.myvitalmate.app.userProfile.dto;

import com.myvitalmate.app.userProfile.entity.DietitianProfile;

import java.time.LocalDate;

public record DietitianProfileDTO(
        String firstName,
        String lastName,
        ContactDTO contact,
        AdresseDTO adresse,
        String gender,
        LocalDate birthday,
        String specialty
) {
    public static DietitianProfileDTO fromEntity(DietitianProfile entity) {
        return new DietitianProfileDTO(
                entity.getFirstName(),
                entity.getLastName(),
                new ContactDTO(
                        entity.getContact().getEmail(),
                        entity.getContact().getPhoneNumber()
                ),
                new AdresseDTO(
                        entity.getAdresse().getStreet(),
                        entity.getAdresse().getCity(),
                        entity.getAdresse().getCountry(),
                        entity.getAdresse().getPostalCode()
                ),
                entity.getGender(),
                entity.getBirthday(),
                entity.getSpecialty()
        );
    }
}
