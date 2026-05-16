package com.example.bank.fraud.dto;

import com.example.bank.fraud.entity.FraudReviewStatus;
import jakarta.validation.constraints.NotNull;

public record FraudReviewRequest(@NotNull FraudReviewStatus status, String note) {
}
