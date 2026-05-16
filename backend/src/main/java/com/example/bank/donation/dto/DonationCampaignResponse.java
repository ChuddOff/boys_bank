package com.example.bank.donation.dto;

import java.math.BigDecimal;

public record DonationCampaignResponse(
        Long id,
        String title,
        String description,
        Long targetAccountId,
        BigDecimal collectedAmount,
        Boolean active
) {
}
