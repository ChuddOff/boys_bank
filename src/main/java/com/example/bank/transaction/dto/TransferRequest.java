package com.example.bank.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TransferRequest(
        @NotNull Long fromAccountId,
        @NotBlank String toIban,
        @NotNull @DecimalMin("0.01") BigDecimal amount,
        @NotBlank String operationId,
        String description
) {
}
