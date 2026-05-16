package com.example.bank.product.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ProductRateService {
    public BigDecimal loanRateFor(BigDecimal amount, int months) {
        BigDecimal base = BigDecimal.valueOf(18.5);
        if (amount.compareTo(BigDecimal.valueOf(1_000_000)) >= 0) {
            base = base.add(BigDecimal.valueOf(1.2));
        }
        if (months > 60) {
            base = base.add(BigDecimal.valueOf(1.5));
        } else if (months <= 12) {
            base = base.subtract(BigDecimal.valueOf(0.8));
        }
        return base.setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal depositRateFor(BigDecimal amount, int months) {
        BigDecimal base;
        if (months < 6) {
            base = BigDecimal.valueOf(11.0);
        } else if (months < 12) {
            base = BigDecimal.valueOf(12.5);
        } else if (months <= 24) {
            base = BigDecimal.valueOf(13.75);
        } else {
            base = BigDecimal.valueOf(12.75);
        }
        if (amount.compareTo(BigDecimal.valueOf(300_000)) >= 0) {
            base = base.add(BigDecimal.valueOf(0.5));
        }
        return base.setScale(2, RoundingMode.HALF_UP);
    }
}
