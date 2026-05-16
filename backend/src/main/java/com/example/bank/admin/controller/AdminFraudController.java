package com.example.bank.admin.controller;

import com.example.bank.fraud.dto.FraudReviewRequest;
import com.example.bank.fraud.dto.FraudTransactionResponse;
import com.example.bank.fraud.service.FraudTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fraud/transactions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminFraudController {
    private final FraudTransactionService fraudTransactionService;

    @GetMapping
    public List<FraudTransactionResponse> transactions() {
        return fraudTransactionService.all();
    }

    @PostMapping("/{id}/review")
    public FraudTransactionResponse review(@PathVariable Long id, @Valid @RequestBody FraudReviewRequest request) {
        return fraudTransactionService.adminReview(id, request);
    }
}
