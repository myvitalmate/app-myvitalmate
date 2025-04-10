package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.userProfile.dto.DietitianRegistrationDTO;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import com.myvitalmate.app.userProfile.repository.DietitianProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DietitianService {

    @Autowired
    private DietitianProfileRepository repository;
    @Autowired
    private ValidationService validationService;

    public DietitianProfile registerDietitian(DietitianRegistrationDTO dietitianRegistrationDTO) {

        validationService.validateFirstName(dietitianRegistrationDTO.firstName(), "First Name");
        validationService.validateLastName(dietitianRegistrationDTO.lastName(), "Last Name");
        validationService.validateCity(dietitianRegistrationDTO.adresse().city());
        validationService.validateStreet(dietitianRegistrationDTO.adresse().street());
        validationService.validateCountry(dietitianRegistrationDTO.adresse().country());
        validationService.validatePostalcode(dietitianRegistrationDTO.adresse().postalCode());
        validationService.validateEmail(dietitianRegistrationDTO.contact().email());
        validationService.validatePhoneNumber(dietitianRegistrationDTO.contact().phoneNumber());
        validationService.validateGender(dietitianRegistrationDTO.gender());
        validationService.validateBirthday(dietitianRegistrationDTO.birthday());

        validationService.validateSpecialty(dietitianRegistrationDTO.specialty());

        DietitianProfile dietitianProfile = new DietitianProfile(dietitianRegistrationDTO);
        return repository.save(dietitianProfile);
    }
}
