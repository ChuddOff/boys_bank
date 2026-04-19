package com.example.bank.donation.controller;

import com.example.bank.donation.dto.CreateCampaignRequest;
import com.example.bank.donation.dto.DonateRequest;
import com.example.bank.donation.dto.DonationCampaignResponse;
import com.example.bank.donation.service.DonationService;
import com.example.bank.transaction.dto.TransactionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping("/campaigns")
    public DonationCampaignResponse createCampaign(Authentication authentication, @Valid @RequestBody CreateCampaignRequest request) {
        return donationService.createCampaign(authentication.getName(), request);
    }

    @GetMapping("/campaigns")
    public List<DonationCampaignResponse> activeCampaigns() {
        return donationService.activeCampaigns();
    }

    @PostMapping("/send")
    public TransactionResponse donate(Authentication authentication, @Valid @RequestBody DonateRequest request) {
        return donationService.donate(authentication.getName(), request);
    }
}
