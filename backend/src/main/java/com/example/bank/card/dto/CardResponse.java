package com.example.bank.card.dto;

import com.example.bank.card.entity.CardStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CardResponse(
        Long id,
        Long accountId,
        String maskedNumber,
        LocalDate expiresAt,
        CardStatus status,
        String tier,
        String displayName,
        BigDecimal cashbackRate,
        BigDecimal monthlyFee,
        BigDecimal dailyLimit
) {
}
