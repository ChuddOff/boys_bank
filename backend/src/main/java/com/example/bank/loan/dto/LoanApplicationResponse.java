package com.example.bank.loan.dto;

import com.example.bank.loan.entity.LoanApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoanApplicationResponse(
        Long id,
        BigDecimal amount,
        Integer termMonths,
        BigDecimal annualRate,
        String purpose,
        LoanApplicationStatus status,
        LocalDateTime createdAt
) {
}
