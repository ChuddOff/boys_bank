package com.example.bank.ai.dto;

public record FraudCheckResponse(
        boolean suspicious,
        int riskScore,
        String reason,
        String source
) {
}
