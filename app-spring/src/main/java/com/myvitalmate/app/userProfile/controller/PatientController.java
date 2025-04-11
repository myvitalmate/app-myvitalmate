package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.PatientRegistrationDTO;
import com.myvitalmate.app.userProfile.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/create")
    public ResponseEntity<Void> registerPatient(@RequestBody PatientRegistrationDTO patientRegistrationDto) {
        patientService.registerPatient(patientRegistrationDto);
        return ResponseEntity.ok().build();
    }
}