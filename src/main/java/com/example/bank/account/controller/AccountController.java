package com.example.bank.account.controller;

import com.example.bank.account.dto.AccountResponse;
import com.example.bank.account.dto.CreateAccountRequest;
import com.example.bank.account.dto.TopUpRequest;
import com.example.bank.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public AccountResponse createAccount(Authentication authentication, @Valid @RequestBody CreateAccountRequest request) {
        return accountService.create(authentication.getName(), request);
    }

    @GetMapping
    public List<AccountResponse> getMyAccounts(Authentication authentication) {
        return accountService.myAccounts(authentication.getName());
    }

    @PostMapping("/{accountId}/top-up")
    public AccountResponse topUp(Authentication authentication, @PathVariable Long accountId, @Valid @RequestBody TopUpRequest request) {
        return accountService.topUp(authentication.getName(), accountId, request.amount());
    }
}
