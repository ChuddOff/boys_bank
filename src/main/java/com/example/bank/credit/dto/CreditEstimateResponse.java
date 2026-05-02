package com.example.bank.credit.dto;

import java.math.BigDecimal;

public record CreditEstimateResponse(
        BigDecimal requestedAmount,
        int termMonths,
        BigDecimal annualRate,
        BigDecimal monthlyPayment,
        BigDecimal totalPayment,
        BigDecimal overpayment
) {
}
