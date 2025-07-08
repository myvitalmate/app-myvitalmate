package com.myvitalmate.app.test.login;

import com.myvitalmate.app.login.dto.AuthResponseDTO;
import com.myvitalmate.app.login.dto.RegistrationDTO;
import com.myvitalmate.app.login.entity.Role;
import com.myvitalmate.app.login.entity.User;
import com.myvitalmate.app.login.repository.UserRepository;
import com.myvitalmate.app.login.security.JwtTokenProvider;
import com.myvitalmate.app.login.service.UserService;
import com.myvitalmate.app.userProfile.service.ValidationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    public User user;
    public String email = "user@gmail.com";
    public String rawPassword = "Password123";
    public String encodedPassword = "encodedPassword";
    public RegistrationDTO registrationDTO;
    @Mock
    private ValidationService validationService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setup() {
        user = new User(email, encodedPassword, Role.PATIENT);
        registrationDTO = new RegistrationDTO(email, rawPassword, Role.PATIENT);
    }

    @Test
    void register_shouldRegisterUserAndReturnAuthResponse() {
        when(userRepository.existsByEmail(email)).thenReturn(false);
        doNothing().when(validationService).validateEmail(email);
        doNothing().when(validationService).validatePassword(rawPassword);
        doNothing().when(validationService).validateRole("PATIENT");


        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(ArgumentMatchers.any())).thenReturn(user);
        when(jwtTokenProvider.createToken(user)).thenReturn("jwt-token");

        AuthResponseDTO response = userService.register(registrationDTO);

        assertEquals("jwt-token", response.token());
        assertEquals(email, response.email());
        assertEquals(Role.PATIENT, response.role());
    }

    @Test
    void register_shouldThrowExceptionWhenEmailExists() {
        when(userRepository.existsByEmail(email)).thenReturn(true);
        assertThrows(IllegalArgumentException.class, () -> userService.register(registrationDTO));
    }

}
