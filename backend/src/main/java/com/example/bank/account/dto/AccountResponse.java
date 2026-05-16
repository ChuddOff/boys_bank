package com.example.bank.account.dto;

import com.example.bank.account.entity.AccountType;

import java.math.BigDecimal;

public record AccountResponse(
        Long id,
        String iban,
        AccountType type,
        BigDecimal balance,
        String currency,
        Boolean active
) {
}
