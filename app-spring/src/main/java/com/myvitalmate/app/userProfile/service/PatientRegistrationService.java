package com.myvitalmate.app.userProfile.service;

import com.myvitalmate.app.userProfile.dto.PatientRegistrationDTO;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
import com.myvitalmate.app.userProfile.repository.PatientProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientRegistrationService {

    private final PatientProfileRepository repository;

    public PatientRegistrationService(PatientProfileRepository repository) {
        this.repository = repository;
    }

    public PatientProfile registerPatient(PatientRegistrationDTO patientsRegistrationDto) {
        PatientProfile patient = new PatientProfile(patientsRegistrationDto);
        return repository.save(patient);
    }
}
