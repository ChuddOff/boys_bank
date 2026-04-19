package com.example.bank.deposit.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record OpenDepositRequest(
        @NotNull Long sourceAccountId,
        @NotNull @DecimalMin("1000.00") BigDecimal amount,
        @NotNull @DecimalMin("0.01") BigDecimal annualRate,
        @NotNull Integer termMonths
) {
}
