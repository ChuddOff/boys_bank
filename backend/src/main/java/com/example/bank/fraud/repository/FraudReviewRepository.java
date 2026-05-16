package com.example.bank.fraud.repository;

import com.example.bank.fraud.entity.FraudReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FraudReviewRepository extends JpaRepository<FraudReview, Long> {
    Optional<FraudReview> findByTransactionId(Long transactionId);
}
