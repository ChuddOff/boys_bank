package com.example.bank.donation.repository;

import com.example.bank.donation.entity.DonationCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationCampaignRepository extends JpaRepository<DonationCampaign, Long> {
    List<DonationCampaign> findByActiveTrueOrderByCreatedAtDesc();
}
