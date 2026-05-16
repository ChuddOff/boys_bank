package com.example.bank.ai.controller;

import com.example.bank.ai.dto.FraudCheckRequest;
import com.example.bank.ai.dto.FraudCheckResponse;
import com.example.bank.ai.service.FraudGatewayService;
import com.example.bank.fraud.dto.FraudReviewRequest;
import com.example.bank.fraud.dto.FraudTransactionResponse;
import com.example.bank.fraud.service.FraudTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudGatewayService fraudGatewayService;
    private final FraudTransactionService fraudTransactionService;

    @PostMapping({"/check", "/analyze"})
    public FraudCheckResponse check(@Valid @RequestBody FraudCheckRequest request) {
        return fraudGatewayService.check(request);
    }

    @GetMapping("/transactions")
    public java.util.List<FraudTransactionResponse> transactions(Authentication authentication) {
        return fraudTransactionService.suspicious(authentication.getName());
    }

    @GetMapping("/transactions/{id}")
    public FraudTransactionResponse transaction(Authentication authentication, @PathVariable Long id) {
        return fraudTransactionService.get(authentication.getName(), id);
    }

    @PostMapping("/transactions/{id}/review")
    public FraudTransactionResponse review(Authentication authentication, @PathVariable Long id, @Valid @RequestBody FraudReviewRequest request) {
        return fraudTransactionService.review(authentication.getName(), id, request);
    }
}
