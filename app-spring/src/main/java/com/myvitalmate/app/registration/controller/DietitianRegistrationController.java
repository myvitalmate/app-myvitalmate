package com.myvitalmate.app.registration.controller;

import com.myvitalmate.app.registration.dto.DietitianRegistrationDTO;
import com.myvitalmate.app.registration.entity.DietitianProfile;
import com.myvitalmate.app.registration.service.DietitianRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dietitians")
public class DietitianRegistrationController {


    @Autowired
    private DietitianRegistrationService dietitianService;

    @PostMapping("/register")
    public ResponseEntity<DietitianProfile> registerDietitian(@RequestBody DietitianRegistrationDTO dietitianRegistrationDTO) {
        DietitianProfile registeredDietitian = dietitianService.registerDietitian(dietitianRegistrationDTO);
        return ResponseEntity.ok(registeredDietitian);
    }

}
