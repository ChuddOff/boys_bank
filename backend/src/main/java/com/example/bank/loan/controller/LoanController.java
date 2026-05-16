package com.example.bank.loan.controller;

import com.example.bank.loan.dto.LoanApplicationRequest;
import com.example.bank.loan.dto.LoanApplicationResponse;
import com.example.bank.loan.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {
    private final LoanService loanService;

    @GetMapping
    public List<LoanApplicationResponse> loans(Authentication authentication) {
        return loanService.loans(authentication.getName());
    }

    @PostMapping("/applications")
    public LoanApplicationResponse apply(Authentication authentication, @Valid @RequestBody LoanApplicationRequest request) {
        return loanService.apply(authentication.getName(), request);
    }
}
