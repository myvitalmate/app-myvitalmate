package com.myvitalmate.app.login.service;

import com.myvitalmate.app.login.dto.AuthResponseDTO;
import com.myvitalmate.app.login.dto.LoginDTO;
import com.myvitalmate.app.login.dto.RegistrationDTO;
import com.myvitalmate.app.login.entity.Role;
import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.login.repository.UserRepository;
import com.myvitalmate.app.login.security.JwtTokenProvider;
import com.myvitalmate.app.userProfile.service.ValidationService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private ValidationService validationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Transactional
    public AuthResponseDTO register(RegistrationDTO registrationDTO) {
        if (userRepository.existsByEmail(registrationDTO.email())) {
            throw new IllegalArgumentException("Email already in use");
        }
        //validationService.validateEmail(registrationDTO.email());
        validationService.validatePassword(registrationDTO.password());
        validationService.validateRole(registrationDTO.role().name());

        User user = new User(
                registrationDTO.email(),
                passwordEncoder.encode(registrationDTO.password()),
                registrationDTO.role()
        );
        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.createToken(savedUser);

        return new AuthResponseDTO(token, savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.username())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(loginDTO.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtTokenProvider.createToken(user);
        return new AuthResponseDTO(token, user.getEmail(), user.getRole());
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public Role getCurrentUserRole() {
        User user = getCurrentUser();
        return user.getRole();
    }
}