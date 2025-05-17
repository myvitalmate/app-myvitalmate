package com.myvitalmate.app.userProfile.controller;

import com.myvitalmate.app.userProfile.dto.DietitianProfileDTO;
import com.myvitalmate.app.userProfile.dto.DietitianProfileUpdateDTO;
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

    //TODO change endpoint to blank.
    @PostMapping("/create")
    public ResponseEntity<Void> createDietitianProfile(@RequestBody DietitianProfileDTO dietitianProfileDTO) {
        dietitianService.createDietitianProfile(dietitianProfileDTO);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/viewAll")
    public ResponseEntity<List<DietitianProfileDTO>> viewMyDietitians() {
        List<DietitianProfileDTO> dietitians = dietitianService.viewMyDietitians();
        return ResponseEntity.ok(dietitians);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteDietitianProfile(@RequestParam Long id) {
        dietitianService.deleteDietitianProfile(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDietitianProfile(
            @PathVariable Long id,
            @RequestBody DietitianProfileUpdateDTO dto
    ) {
        dietitianService.updateDietitianProfile(id, dto);
        return ResponseEntity.ok().build();
    }
}