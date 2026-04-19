package com.example.bank.donation.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DonateRequest(
        @NotNull Long fromAccountId,
        @NotNull Long campaignId,
        @NotNull @DecimalMin("1.00") BigDecimal amount,
        @NotBlank String operationId,
        String message
) {
}
