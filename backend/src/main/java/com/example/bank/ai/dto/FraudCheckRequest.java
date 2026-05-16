package com.example.bank.ai.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record FraudCheckRequest(
        @NotBlank String message,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotBlank String currency
) {
}
