package com.example.bank.account.dto;

import com.example.bank.account.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public record CreateAccountRequest(
        @NotNull AccountType type,
        String currency
) {
}
