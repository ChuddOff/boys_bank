package com.example.bank.customer.dto;

public record AuthResponse(String token, String tokenType, long expiresInSeconds) {
}
