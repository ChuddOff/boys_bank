package com.example.bank.transaction.controller;

import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.dto.TransferRequest;
import com.example.bank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public TransactionResponse transfer(Authentication authentication, @Valid @RequestBody TransferRequest request) {
        return transactionService.transfer(authentication.getName(), request);
    }

    @GetMapping("/history")
    public List<TransactionResponse> history(Authentication authentication) {
        return transactionService.history(authentication.getName());
    }
}
