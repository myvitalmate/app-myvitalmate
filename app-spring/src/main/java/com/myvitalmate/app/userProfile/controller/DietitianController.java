package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.entity.DietitianProfile;
import com.myvitalmate.app.userProfile.service.DietitianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dietitians")
public class DietitianController {

    @Autowired
    private DietitianService dietitianService;

    @PostMapping("/create")
    public ResponseEntity<Void> registerDietitian(@RequestBody DietitianProfileDTO dietitianProfileDTO) {
        DietitianProfile dietitianProfile = dietitianService.registerDietitian(dietitianProfileDTO);
        return ResponseEntity.ok().build();
    }
}
