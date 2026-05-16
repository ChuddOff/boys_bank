package com.example.bank.profile.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record UpdateProfileRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
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
