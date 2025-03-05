package com.myvitalmate.app.login.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {

    @GetMapping("/login")
    public Map<String, Object> securedEndpoint(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
        Map<String, Object> response = new HashMap<>();
        response.put("username", principal.getUsername());
        response.put("roles", principal.getAuthorities());
        return response;
    }
}
