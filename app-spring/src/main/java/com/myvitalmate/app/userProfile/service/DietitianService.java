package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.login.entity.Role;
import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.login.repository.UserRepository;
import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.dto.DietitianProfileUpdateDTO;
import com.myvitalmate.app.userProfile.entity.Adresse;
import com.myvitalmate.app.userProfile.entity.Contact;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import com.myvitalmate.app.userProfile.mapper.DietitianMapper;
import com.myvitalmate.app.userProfile.repository.DietitianProfileRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class DietitianService {
    @Autowired
    private DietitianMapper dietitianMapper;
    @Autowired
    private DietitianProfileRepository repository;
    @Autowired
    private ValidationService validationService;
    @Autowired
    private UserRepository userRepository;

    public void createDietitianProfile(DietitianProfileDTO dto) {
        User currentUser = getCurrentUser();

        if (currentUser.getRole() == Role.DIETITIAN) {
            List<DietitianProfile> existingProfiles = repository.findByUser(currentUser);
            if (!existingProfiles.isEmpty()) {
                throw new ValidationException("As a dietitian, you can only create one profile.");
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

        validationService.validateSpecialty(dto.specialty());
        DietitianProfile dietitian = dietitianMapper.toEntity(dto);
        dietitian.setUser(getCurrentUser());
        repository.save(dietitian);
    }

    public List<DietitianProfileDTO> viewAllDietitians() {
        List<DietitianProfile> dietitians = repository.findAll();
        if (dietitians.isEmpty()) {
            throw new RuntimeException("No dietitians found in database");
        }
        return dietitianMapper.toDtoList(dietitians);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<DietitianProfileDTO> viewMyDietitians() {
        User currentUser = getCurrentUser();
        List<DietitianProfile> dietitians = repository.findByUser(currentUser);
        return dietitianMapper.toDtoList(dietitians);
    }

    public void deleteDietitianProfile(Long id) {
        DietitianProfile dietitian = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dietitian profile not found"));

        User currentUser = getCurrentUser();
        if (!dietitian.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to delete this profile");
        }

        repository.deleteById(id);
    }

    public void updateDietitianProfile(Long id, DietitianProfileUpdateDTO dto) {
        DietitianProfile dietitian = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dietitian not found"));

        User currentUser = getCurrentUser();
        if (!dietitian.getUser().getId().equals(currentUser.getId())) {
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
        validationService.validateSpecialty(dto.specialty());

        dietitian.setFirstName(dto.firstName());
        dietitian.setLastName(dto.lastName());
        dietitian.setAdresse(new Adresse(dto.adresse()));
        dietitian.setContact(new Contact(dto.contact()));
        dietitian.setGender(dto.gender());
        dietitian.setBirthday(dto.birthday());
        dietitian.setSpecialty(dto.specialty());

        repository.save(dietitian);
    }
}
