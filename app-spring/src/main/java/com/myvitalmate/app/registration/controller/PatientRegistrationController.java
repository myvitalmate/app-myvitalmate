package com.myvitalmate.app.registration.controller;

import com.myvitalmate.app.registration.dto.PatientRegistrationDTO;
import com.myvitalmate.app.registration.entity.PatientProfile;
import com.myvitalmate.app.registration.service.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
public class PatientRegistrationController {

    @Autowired
    private PatientRegistrationService patientRegistrationService;

    @PostMapping("/register")
    public ResponseEntity<Void> registerPatient(@RequestBody PatientRegistrationDTO patientRegistrationDto) {
        PatientProfile registeredPatient = patientRegistrationService.registerPatient(patientRegistrationDto);
        return ResponseEntity.ok().build();
    }
}