package com.employeematching.service;

import com.employeematching.dto.request.ChangePasswordRequest;
import com.employeematching.dto.request.LoginRequest;
import com.employeematching.dto.response.LoginResponse;
import com.employeematching.dto.response.UserResponse;
import com.employeematching.entity.User;
import com.employeematching.repository.UserRepository;
import com.employeematching.security.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isActive()) {
            throw new RuntimeException("Your account is currently deactivated. Please contact an administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getId(),
                user.getRole().name()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isMustChangePassword()
        );
    }

    public void changePassword(ChangePasswordRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new RuntimeException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
    }

    public UserResponse getCurrentUser(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.isMustChangePassword(),
                user.getCreatedAt()
        );
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}