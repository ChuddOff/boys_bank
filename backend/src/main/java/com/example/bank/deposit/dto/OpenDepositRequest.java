package com.example.bank.deposit.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OpenDepositRequest(
        @NotNull Long sourceAccountId,
        @NotNull @DecimalMin("1000.00") BigDecimal amount,
        @NotNull Integer termMonths,
        String productName,
        Boolean capitalization,
        Boolean earlyWithdrawal
) {
}
