package com.example.bank.account.dto;

import java.math.BigDecimal;

public record BalanceResponse(Long accountId, BigDecimal balance, String currency) {
}
