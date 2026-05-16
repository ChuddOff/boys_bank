package com.example.bank.loan.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record LoanApplicationRequest(
        @NotNull @DecimalMin("1000.00") BigDecimal amount,
        @NotNull Integer termMonths,
        String purpose
) {
}
