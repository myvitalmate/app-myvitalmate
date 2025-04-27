package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import com.myvitalmate.app.userProfile.mapper.DietitianMapper;
import com.myvitalmate.app.userProfile.repository.DietitianProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DietitianService {
    @Autowired
    private DietitianMapper dietitianMapper;
    @Autowired
    private DietitianProfileRepository repository;
    @Autowired
    private ValidationService validationService;

    public DietitianProfile createDietitianProfile(DietitianProfileDTO dto) {

        validationService.validateFirstName(dto.firstName(), "First Name");
        validationService.validateLastName(dto.lastName(), "Last Name");
        validationService.validateCity(dto.adresse().city());
        validationService.validateStreet(dto.adresse().street());
        validationService.validateCountry(dto.adresse().country());
        validationService.validatePostalcode(dto.adresse().postalCode());
        validationService.validateEmail(dto.contact().email());
        validationService.validatePhoneNumber(dto.contact().phoneNumber());
        validationService.validateGender(dto.gender());
        validationService.validateBirthday(dto.birthday());

        validationService.validateSpecialty(dto.specialty());

        if (repository.existingContactData(
                dto.contact().email(),
                dto.contact().phoneNumber()
        )) {
            throw new ValidationException("A profile with the same email, phone number, or address already exists.");
        }


        DietitianProfile dietitianProfile = dietitianMapper.toEntity(dto);
        return repository.save(dietitianProfile);
    }

    public List<DietitianProfileDTO> viewAllDietitians() {
        List<DietitianProfile> dietitians = repository.findAll();
        if (dietitians.isEmpty()) {
            throw new RuntimeException("No dietitians found in database");
        }
        return dietitianMapper.toDtoList(dietitians);
    }
}
