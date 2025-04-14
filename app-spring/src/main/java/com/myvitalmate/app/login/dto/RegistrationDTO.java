package com.myvitalmate.app.login.dto;

import com.myvitalmate.app.login.entity.Role;

public record RegistrationDTO(
        String email,
        String password,
        Role role
) {
}
