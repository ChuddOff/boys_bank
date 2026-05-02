package com.example.bank.support.dto;

import jakarta.validation.constraints.NotBlank;

public record SupportMessageRequest(@NotBlank String message) {
}
