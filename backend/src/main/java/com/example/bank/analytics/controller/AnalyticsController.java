package com.example.bank.analytics.controller;

import com.example.bank.analytics.dto.MonthlySpendingResponse;
import com.example.bank.transaction.entity.BankTransaction;
import com.example.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final TransactionRepository transactionRepository;

    @GetMapping("/monthly")
    public MonthlySpendingResponse monthly(Authentication authentication, @RequestParam int year, @RequestParam int month) {
        YearMonth target = YearMonth.of(year, month);
        List<BankTransaction> transactions = transactionRepository
                .findByFromAccountOwnerEmailOrToAccountOwnerEmailOrderByCreatedAtDesc(authentication.getName(), authentication.getName());

        long outgoingOps = 0;
        long incomingOps = 0;
        BigDecimal outgoingTotal = BigDecimal.ZERO;
        BigDecimal incomingTotal = BigDecimal.ZERO;

        for (BankTransaction tx : transactions) {
            if (!YearMonth.from(tx.getCreatedAt()).equals(target)) {
                continue;
            }
            if (tx.getFromAccount() != null && authentication.getName().equalsIgnoreCase(tx.getFromAccount().getOwner().getEmail())) {
                outgoingOps++;
                outgoingTotal = outgoingTotal.add(tx.getAmount());
            }
            if (tx.getToAccount() != null && authentication.getName().equalsIgnoreCase(tx.getToAccount().getOwner().getEmail())) {
                incomingOps++;
                incomingTotal = incomingTotal.add(tx.getAmount());
            }
        }

        return new MonthlySpendingResponse(target.toString(), outgoingOps, outgoingTotal, incomingOps, incomingTotal);
    }
}
