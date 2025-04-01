package com.myvitalmate.app.registration.service;

import com.myvitalmate.app.registration.dto.DietitianRegistrationDTO;
import com.myvitalmate.app.registration.entity.Adresse;
import com.myvitalmate.app.registration.entity.Contact;
import com.myvitalmate.app.registration.entity.DietitianProfile;
import com.myvitalmate.app.registration.entity.Name;
import com.myvitalmate.app.registration.repository.DietitianProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class DietitianRegistrationService {

    private final DietitianProfileRepository repository;

    public DietitianRegistrationService(DietitianProfileRepository repository) {
        this.repository = repository;
    }

    public DietitianProfile registerDietitian(DietitianRegistrationDTO dietitianRegistrationDTO) {
        DietitianProfile dietitian = new DietitianProfile(
                new Name(dietitianRegistrationDTO.name().firstName(), dietitianRegistrationDTO.name().lastName()),
                new Contact(dietitianRegistrationDTO.contact().phoneNumber(), dietitianRegistrationDTO.contact().email()),
                new Adresse(dietitianRegistrationDTO.adresse().street(), dietitianRegistrationDTO.adresse().city(), dietitianRegistrationDTO.adresse().postalCode(), dietitianRegistrationDTO.adresse().country()),
                dietitianRegistrationDTO.birthday(),
                dietitianRegistrationDTO.gender(),
                dietitianRegistrationDTO.photoUrl(),
                dietitianRegistrationDTO.specialty()
        );

        return repository.save(dietitian);
    }

}
