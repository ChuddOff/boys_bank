package com.example.bank.account.controller;

import com.example.bank.account.dto.AccountResponse;
import com.example.bank.account.dto.BalanceResponse;
import com.example.bank.account.dto.CreateAccountRequest;
import com.example.bank.account.dto.TopUpRequest;
import com.example.bank.account.service.AccountService;
import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.service.TransactionService;
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
    private final TransactionService transactionService;

    @PostMapping
    public AccountResponse createAccount(Authentication authentication, @Valid @RequestBody CreateAccountRequest request) {
        return accountService.create(authentication.getName(), request);
    }

    @GetMapping
    public List<AccountResponse> getMyAccounts(Authentication authentication) {
        return accountService.myAccounts(authentication.getName());
    }

    @GetMapping("/{accountId}")
    public AccountResponse getAccount(Authentication authentication, @PathVariable Long accountId) {
        return accountService.get(authentication.getName(), accountId);
    }

    @GetMapping("/{accountId}/balance")
    public BalanceResponse balance(Authentication authentication, @PathVariable Long accountId) {
        AccountResponse account = accountService.get(authentication.getName(), accountId);
        return new BalanceResponse(account.id(), account.balance(), account.currency());
    }

    @PostMapping("/{accountId}/top-up")
    public AccountResponse topUp(Authentication authentication, @PathVariable Long accountId, @Valid @RequestBody TopUpRequest request) {
        return accountService.topUp(authentication.getName(), accountId, request.amount());
    }

    @GetMapping("/{accountId}/transactions")
    public List<TransactionResponse> transactions(Authentication authentication, @PathVariable Long accountId) {
        return transactionService.accountHistory(authentication.getName(), accountId);
    }

    @PostMapping("/{accountId}/withdraw")
    public AccountResponse withdraw(Authentication authentication, @PathVariable Long accountId, @Valid @RequestBody TopUpRequest request) {
        return accountService.withdraw(authentication.getName(), accountId, request.amount());
    }
}
