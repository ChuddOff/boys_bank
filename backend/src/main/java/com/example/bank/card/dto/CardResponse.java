package com.example.bank.card.dto;

import com.example.bank.card.entity.CardStatus;

import java.time.LocalDate;

public record CardResponse(Long id, Long accountId, String maskedNumber, LocalDate expiresAt, CardStatus status) {
}
