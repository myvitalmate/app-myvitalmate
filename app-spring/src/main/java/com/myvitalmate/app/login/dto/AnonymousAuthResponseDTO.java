package com.myvitalmate.app.login.dto;

public record AnonymousAuthResponseDTO(
        String token,
        String role
) {
}
