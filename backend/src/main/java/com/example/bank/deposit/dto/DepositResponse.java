package com.example.bank.deposit.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DepositResponse(
        Long id,
        Long accountId,
        BigDecimal principal,
        BigDecimal annualRate,
        Integer termMonths,
        LocalDate openedAt,
        LocalDate maturityDate,
        BigDecimal projectedPayout,
        Boolean active
) {
}
