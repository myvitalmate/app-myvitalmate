package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.login.entity.Role;
import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.login.repository.UserRepository;
import com.myvitalmate.app.nutrientLog.repository.NutrientLogRepository;
import com.myvitalmate.app.userProfile.dto.AnonymousPatientProfileDTO;
import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import com.myvitalmate.app.userProfile.dto.PatientProfileUpdateDTO;
import com.myvitalmate.app.userProfile.entity.Adresse;
import com.myvitalmate.app.userProfile.entity.Contact;
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
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PatientService {

    @Autowired
    private PatientProfileRepository patientProfilerepository;

    @Autowired
    private NutrientLogRepository nutrientLogRepository;

    @Autowired
    private PatientMapper patientMapper;

    @Autowired
    private ValidationService validationService;

    @Autowired
    private UserRepository userRepository;

    public void createPatientProfile(PatientProfileDTO dto) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.PATIENT) {
            List<PatientProfile> existingProfiles = patientProfilerepository.findByUser(currentUser);
            if (!existingProfiles.isEmpty()) {
                throw new ValidationException("As a patient, you can only create one profile.");
            }
        }

        validationService.validateFirstName(dto.firstName());
        validationService.validateLastName(dto.lastName());
        validationService.validateCity(dto.adresse().city());
        validationService.validateStreet(dto.adresse().street());
        validationService.validateCountry(dto.adresse().country());
        validationService.validatePostalcode(dto.adresse().postalCode());
        //validationService.validateEmail(dto.contact().email());
        validationService.validatePhoneNumber(dto.contact().phoneNumber());
        validationService.validateGender(dto.gender());
        validationService.validateBirthday(dto.birthday());
        validationService.validateDietOrientation(dto.dietOrientation());
        validationService.validateCurrentWeight(dto.currentWeight());
        validationService.validateSickness(dto.sickness());
        validationService.validateGoals(dto.goals());

        PatientProfile patient = patientMapper.toEntity(dto);
        patient.setUser(getCurrentUser());
        patientProfilerepository.save(patient);
    }

    public void createAnonymousPatientProfile(AnonymousPatientProfileDTO dto) {
        UUID anonymousId = getAnonymousId();

        Optional<PatientProfile> existing = patientProfilerepository.findByAnonymousUuid(anonymousId);
        if (existing.isPresent()) {
            throw new ValidationException("Anonymous profile already exists");
        }

        PatientProfile patient = new PatientProfile();
        patient.setAnonymousUuid(anonymousId);
        patientProfilerepository.save(patient);
    }

    public List<PatientProfileDTO> viewAllPatients() {
        List<PatientProfile> patients = patientProfilerepository.findAll();
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
        try {
            User currentUser = getCurrentUser();
            List<PatientProfile> patients = patientProfilerepository.findByUser(currentUser);
            return patientMapper.toDtoList(patients);
        } catch (UsernameNotFoundException e) {
            UUID anonymousId = getAnonymousId();
            Optional<PatientProfile> patient = patientProfilerepository.findByAnonymousUuid(anonymousId);
            return patient.map(p -> List.of(patientMapper.toDto(p))).orElse(List.of());
        }
    }

    @Transactional
    public void deletePatientProfile(Long id) {
        PatientProfile patient = patientProfilerepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        User currentUser = getCurrentUser();
        if (!patient.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this profile");
        }
        nutrientLogRepository.deleteByPatientId(id);
        patientProfilerepository.deleteById(id);
    }

    public void updatePatientProfile(Long id, PatientProfileUpdateDTO dto) {
        PatientProfile patient = patientProfilerepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        User currentUser = getCurrentUser();
        if (!patient.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to update this profile");
        }

        validationService.validateFirstName(dto.firstName());
        validationService.validateLastName(dto.lastName());
        validationService.validateCity(dto.adresse().city());
        validationService.validateStreet(dto.adresse().street());
        validationService.validateCountry(dto.adresse().country());
        validationService.validatePostalcode(dto.adresse().postalCode());
        //validationService.validateEmail(dto.contact().email());
        validationService.validatePhoneNumber(dto.contact().phoneNumber());
        validationService.validateGender(dto.gender());
        validationService.validateBirthday(dto.birthday());
        validationService.validateDietOrientation(dto.dietOrientation());
        validationService.validateCurrentWeight(dto.currentWeight());
        validationService.validateSickness(dto.sickness());
        validationService.validateGoals(dto.goals());

        patient.setFirstName(dto.firstName());
        patient.setLastName(dto.lastName());
        patient.setAdresse(new Adresse(dto.adresse()));
        patient.setContact(new Contact(dto.contact()));
        patient.setGender(dto.gender());
        patient.setBirthday(dto.birthday());
        patient.setDietOrientation(dto.dietOrientation());
        patient.setCurrentWeight(dto.currentWeight());
        patient.setSickness(dto.sickness());
        patient.setGoals(dto.goals());

        patientProfilerepository.save(patient);
    }

    private UUID getAnonymousId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        if (username.startsWith("anonymous_")) {
            return UUID.fromString(username.substring(10));
        }

        throw new RuntimeException("Not an anonymous user");
    }

}
