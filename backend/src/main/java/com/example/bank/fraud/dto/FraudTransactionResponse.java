package com.example.bank.fraud.dto;

import com.example.bank.fraud.entity.FraudReviewStatus;
import com.example.bank.transaction.dto.TransactionResponse;

public record FraudTransactionResponse(
        Long id,
        TransactionResponse transaction,
        boolean suspicious,
        int riskScore,
        String reason,
        String source,
        FraudReviewStatus status,
        String reviewerNote
) {
}
