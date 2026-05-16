package com.example.bank.donation.dto;

import java.math.BigDecimal;

public record DonationCampaignResponse(
        Long id,
        String title,
        String description,
        String category,
        String sourceUrl,
        String impact,
        Long targetAccountId,
        BigDecimal collectedAmount,
        Boolean active
) {
}
