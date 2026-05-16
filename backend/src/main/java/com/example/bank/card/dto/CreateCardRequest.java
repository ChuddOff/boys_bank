package com.example.bank.card.dto;

import jakarta.validation.constraints.NotNull;

public record CreateCardRequest(
        @NotNull Long accountId,
        String tier
) {
}
