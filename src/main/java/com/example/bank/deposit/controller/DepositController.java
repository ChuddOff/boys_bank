package com.example.bank.deposit.controller;

import com.example.bank.deposit.dto.DepositResponse;
import com.example.bank.deposit.dto.OpenDepositRequest;
import com.example.bank.deposit.service.DepositService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deposits")
@RequiredArgsConstructor
public class DepositController {

    private final DepositService depositService;

    @PostMapping
    public DepositResponse openDeposit(Authentication authentication, @Valid @RequestBody OpenDepositRequest request) {
        return depositService.openDeposit(authentication.getName(), request);
    }

    @GetMapping
    public List<DepositResponse> myDeposits(Authentication authentication) {
        return depositService.myDeposits(authentication.getName());
    }
}
