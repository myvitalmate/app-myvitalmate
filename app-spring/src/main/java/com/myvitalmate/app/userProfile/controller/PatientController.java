package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import com.myvitalmate.app.userProfile.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/create")
    public ResponseEntity<Void> createPatientProfile(@RequestBody PatientProfileDTO patientProfileDto) {
        patientService.createPatientProfile(patientProfileDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewAll")
    public ResponseEntity<List<PatientProfileDTO>> viewMyPatients() {
        List<PatientProfileDTO> patients = patientService.viewMyPatients();
        return ResponseEntity.ok(patients);
    }
}