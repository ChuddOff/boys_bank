package com.example.bank.transaction.dto;

import com.example.bank.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        Long fromAccountId,
        Long toAccountId,
        BigDecimal amount,
        TransactionType type,
        String operationId,
        LocalDateTime createdAt,
        String description
) {
}
