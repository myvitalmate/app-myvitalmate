package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.service.DietitianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dietitians")
public class DietitianController {

    @Autowired
    private DietitianService dietitianService;

    @PostMapping("/create")
    public ResponseEntity<Void> registerDietitian(@RequestBody DietitianProfileDTO dietitianProfileDTO) {
        dietitianService.registerDietitian(dietitianProfileDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewAll")
    public ResponseEntity<List<DietitianProfileDTO>> viewAllDietitians() {
        try {
            List<DietitianProfileDTO> dietitians = dietitianService.viewAllDietitians();
            return ResponseEntity.ok(dietitians);
        } catch (RuntimeException e) {
            return ResponseEntity.noContent().build();
        }
    }
}
