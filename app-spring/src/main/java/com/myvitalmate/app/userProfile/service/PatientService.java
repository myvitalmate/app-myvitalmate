package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.userProfile.dto.PatientRegistrationDTO;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import com.myvitalmate.app.userProfile.repository.PatientProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private PatientProfileRepository repository;
    @Autowired
    private ValidationService validationService;


    public PatientProfile registerPatient(PatientRegistrationDTO patientsRegistrationDto) {

        validationService.validateLastName(patientsRegistrationDto.lastName(), "Last Name");
        validationService.validateCity(patientsRegistrationDto.adresse().city());
        validationService.validateStreet(patientsRegistrationDto.adresse().street());
        validationService.validateCountry(patientsRegistrationDto.adresse().country());
        validationService.validatePostalcode(patientsRegistrationDto.adresse().postalCode());
        validationService.validateEmail(patientsRegistrationDto.contact().email());
        validationService.validatePhoneNumber(patientsRegistrationDto.contact().phoneNumber());
        validationService.validateGender(patientsRegistrationDto.gender());
        validationService.validateBirthday(patientsRegistrationDto.birthday());

        validationService.validateDietOrientation(patientsRegistrationDto.dietOrientation());
        validationService.validateCurrentWeight(patientsRegistrationDto.currentWeight());
        validationService.validateSickness(patientsRegistrationDto.sickness());
        validationService.validateGoals(patientsRegistrationDto.goals());


        PatientProfile patient = new PatientProfile(patientsRegistrationDto);
        return repository.save(patient);
    }
}
