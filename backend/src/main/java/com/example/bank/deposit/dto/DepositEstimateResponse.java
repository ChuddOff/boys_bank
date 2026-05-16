package com.example.bank.deposit.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DepositEstimateResponse(
        BigDecimal amount,
        Integer termMonths,
        BigDecimal annualRate,
        LocalDate maturityDate,
        BigDecimal projectedPayout,
        BigDecimal income
) {
}
