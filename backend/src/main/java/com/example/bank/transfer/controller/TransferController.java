package com.example.bank.transfer.controller;

import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.dto.TransferRequest;
import com.example.bank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
public class TransferController {
    private final TransactionService transactionService;

    @PostMapping
    public TransactionResponse transfer(Authentication authentication, @Valid @RequestBody TransferRequest request) {
        return transactionService.transfer(authentication.getName(), request);
    }
}
