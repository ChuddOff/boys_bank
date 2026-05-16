package com.example.bank.customer.controller;

import com.example.bank.customer.dto.AuthRequest;
import com.example.bank.customer.dto.AuthResponse;
import com.example.bank.customer.dto.RegisterRequest;
import com.example.bank.customer.dto.UserResponse;
import com.example.bank.customer.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CustomerService customerService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return customerService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        return customerService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        return customerService.me(authentication.getName());
    }

    @PostMapping("/logout")
    public java.util.Map<String, String> logout() {
        return java.util.Map.of("status", "ok");
    }
}
