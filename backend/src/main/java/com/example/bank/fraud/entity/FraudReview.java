package com.example.bank.fraud.entity;

import com.example.bank.transaction.entity.BankTransaction;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "transaction_id", unique = true)
    private BankTransaction transaction;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FraudReviewStatus status;

    @Column(length = 512)
    private String reviewerNote;

    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
