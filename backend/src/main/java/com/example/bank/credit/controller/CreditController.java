package com.example.bank.credit.controller;

import com.example.bank.credit.dto.CreditEstimateResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.math.RoundingMode;

@RestController
@RequestMapping("/api/credit")
public class CreditController {

    @GetMapping("/estimate")
    public CreditEstimateResponse estimate(@RequestParam BigDecimal amount,
                                           @RequestParam int months,
                                           @RequestParam(defaultValue = "18.0") BigDecimal annualRate) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0 || months <= 0) {
            throw new IllegalArgumentException("Некорректные параметры кредита");
        }
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlus = BigDecimal.ONE.add(monthlyRate);
        BigDecimal numerator = amount.multiply(monthlyRate).multiply(onePlus.pow(months));
        BigDecimal denominator = onePlus.pow(months).subtract(BigDecimal.ONE);
        BigDecimal monthlyPayment = numerator.divide(denominator, 2, RoundingMode.HALF_UP);
        BigDecimal total = monthlyPayment.multiply(BigDecimal.valueOf(months)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal overpayment = total.subtract(amount).setScale(2, RoundingMode.HALF_UP);
        return new CreditEstimateResponse(amount, months, annualRate, monthlyPayment, total, overpayment);
    }
}
