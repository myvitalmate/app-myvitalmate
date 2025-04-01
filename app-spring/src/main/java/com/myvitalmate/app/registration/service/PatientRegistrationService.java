package com.myvitalmate.app.registration.service;

import com.myvitalmate.app.registration.dto.PatientRegistrationDTO;
import com.myvitalmate.app.registration.entity.Adresse;
import com.myvitalmate.app.registration.entity.Contact;
import com.myvitalmate.app.registration.entity.Name;
import com.myvitalmate.app.registration.entity.PatientProfile;
import com.myvitalmate.app.registration.repository.PatientProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientRegistrationService {

    private final PatientProfileRepository repository;

    public PatientRegistrationService(PatientProfileRepository repository) {
        this.repository = repository;
    }


    public PatientProfile registerPatient(PatientRegistrationDTO patientsRegistrationDto) {
        PatientProfile patient = new PatientProfile(
                new Name(patientsRegistrationDto.name().firstName(), patientsRegistrationDto.name().lastName()),
                new Contact(patientsRegistrationDto.contact().phoneNumber(), patientsRegistrationDto.contact().email()),
                new Adresse(patientsRegistrationDto.adresse().street(), patientsRegistrationDto.adresse().city(), patientsRegistrationDto.adresse().postalCode(), patientsRegistrationDto.adresse().country()),
                patientsRegistrationDto.birthday(),
                patientsRegistrationDto.gender(),
                patientsRegistrationDto.photoUrl(),
                patientsRegistrationDto.dietOrientation(),
                patientsRegistrationDto.currentWeight(),
                patientsRegistrationDto.goals(),
                patientsRegistrationDto.sickness()
        );
        return repository.save(patient);
    }
}
