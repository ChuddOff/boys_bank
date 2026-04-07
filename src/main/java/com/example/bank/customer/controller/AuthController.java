package com.example.bank.customer.controller;

import com.example.bank.customer.dto.RegisterRequest;
import com.example.bank.customer.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CustomerService customerService;

    @PostMapping("/register")
    public void register(@RequestBody RegisterRequest request) {
        customerService.register(request);
    }
}
