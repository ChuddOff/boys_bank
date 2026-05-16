package com.example.bank.profile.controller;

import com.example.bank.customer.dto.UserResponse;
import com.example.bank.customer.service.CustomerService;
import com.example.bank.profile.dto.UpdateProfileRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final CustomerService customerService;

    @GetMapping
    public UserResponse profile(Authentication authentication) {
        return customerService.me(authentication.getName());
    }

    @PatchMapping
    public UserResponse update(Authentication authentication, @Valid @RequestBody UpdateProfileRequest request) {
        return customerService.updateProfile(authentication.getName(), request);
    }
}
