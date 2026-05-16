package com.example.bank.donation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCampaignRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull Long targetAccountId
) {
}
