package com.myvitalmate.app.login.controller;

import com.myvitalmate.app.login.dto.AuthResponseDTO;
import com.myvitalmate.app.login.dto.LoginDTO;
import com.myvitalmate.app.login.dto.RegistrationDTO;
import com.myvitalmate.app.login.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@RequestBody RegistrationDTO registrationDTO) {
        return ResponseEntity.ok(userService.register(registrationDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        return ResponseEntity.ok(userService.login(loginDTO));
    }
}
