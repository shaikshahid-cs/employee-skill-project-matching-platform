package com.employeematching.service;

import com.employeematching.dto.request.LoginRequest;
import com.employeematching.dto.request.RegisterRequest;
import com.employeematching.dto.response.LoginResponse;
import com.employeematching.dto.response.RegisterResponse;
import com.employeematching.entity.User;
import com.employeematching.repository.UserRepository;
import com.employeematching.security.JwtService;
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
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

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
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public RegisterResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User.Role requestedRole = request.getRole();
        if (requestedRole == null) {
            requestedRole = User.Role.EMPLOYEE;
        }

        if (requestedRole == User.Role.EMPLOYEE || requestedRole == User.Role.MANAGER) {
            user.setRole(requestedRole);
        } else {
            throw new RuntimeException("Invalid registration role. Allowed roles: EMPLOYEE, MANAGER");
        }

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }
}