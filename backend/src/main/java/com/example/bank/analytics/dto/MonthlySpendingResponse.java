package com.example.bank.analytics.dto;

import java.math.BigDecimal;

public record MonthlySpendingResponse(
        String month,
        long outgoingOperations,
        BigDecimal outgoingTotal,
        long incomingOperations,
        BigDecimal incomingTotal
) {
}
