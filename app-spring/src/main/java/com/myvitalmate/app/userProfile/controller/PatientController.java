package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.PatientProfileDTO;
import com.myvitalmate.app.userProfile.entity.PatientProfile;
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
    public ResponseEntity<Void> registerPatient(@RequestBody PatientProfileDTO patientProfileDto) {
        patientService.registerPatient(patientProfileDto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewAll")
    public ResponseEntity<List<PatientProfile>> viewAllPatients() {
        try {
            List<PatientProfile> patients = patientService.viewAllPatients();
            return ResponseEntity.ok(patients);
        } catch (RuntimeException e) {
            return ResponseEntity.noContent().build();
        }
    }
}