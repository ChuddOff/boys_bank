package com.example.bank.customer.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        Long id,
        String firstName,
        String lastName,
        String email,
        Set<String> roles,
        LocalDateTime createdAt,
        String phone,
        String city,
        String addressLine,
        String passportNumber,
        String passportIssuedBy,
        String employer,
        String jobTitle,
        BigDecimal monthlyIncome,
        Boolean twoFactorEnabled,
        Boolean pushNotifications,
        Boolean marketingNotifications
) {
}
