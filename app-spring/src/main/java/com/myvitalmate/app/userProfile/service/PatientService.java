package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.login.repository.UserRepository;
import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import com.myvitalmate.app.userProfile.mapper.PatientMapper;
import com.myvitalmate.app.userProfile.repository.PatientProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class PatientService {

    @Autowired
    private PatientProfileRepository repository;

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private UserRepository userRepository;

    public void createPatientProfile(PatientProfileDTO dto) {
        validationService.validateFirstName(dto.firstName());
        validationService.validateLastName(dto.lastName());
        validationService.validateCity(dto.adresse().city());
        validationService.validateStreet(dto.adresse().street());
        validationService.validateCountry(dto.adresse().country());
        validationService.validatePostalcode(dto.adresse().postalCode());
        validationService.validateEmail(dto.contact().email());
        validationService.validatePhoneNumber(dto.contact().phoneNumber());
        validationService.validateGender(dto.gender());
        validationService.validateBirthday(dto.birthday());
        validationService.validateDietOrientation(dto.dietOrientation());
        validationService.validateCurrentWeight(dto.currentWeight());
        validationService.validateSickness(dto.sickness());
        validationService.validateGoals(dto.goals());

        if (repository.existingContactData(
                dto.contact().email(),
                dto.contact().phoneNumber()
        )) {
            throw new ValidationException("A profile with the same email, phone number, or address already exists.");
        }

        PatientProfile patient = patientMapper.toEntity(dto);
        patient.setUser(getCurrentUser());
        repository.save(patient);
    }

    public List<PatientProfileDTO> viewAllPatients() {
        List<PatientProfile> patients = repository.findAll();
        if (patients.isEmpty()) {
            throw new RuntimeException("No patients found in database");
        }
        return patientMapper.toDtoList(patients);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<PatientProfileDTO> viewMyPatients() {
        User currentUser = getCurrentUser();
        List<PatientProfile> patients = repository.findByUser(currentUser);
        return patientMapper.toDtoList(patients);
    }

}
