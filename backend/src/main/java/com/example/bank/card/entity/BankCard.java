package com.example.bank.card.entity;

import com.example.bank.account.entity.BankAccount;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bank_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id")
    private BankAccount account;

    @Column(nullable = false, length = 19)
    private String maskedNumber;

    @Column(nullable = false)
    @Builder.Default
    private String tier = "BLACK";

    @Column(nullable = false)
    @Builder.Default
    private String displayName = "Boys Bank Black";

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private java.math.BigDecimal cashbackRate = java.math.BigDecimal.valueOf(1.5);

    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private java.math.BigDecimal monthlyFee = java.math.BigDecimal.ZERO;

    @Column(nullable = false, precision = 19, scale = 2)
    @Builder.Default
    private java.math.BigDecimal dailyLimit = java.math.BigDecimal.valueOf(150000);

    @Column(nullable = false)
    private LocalDate expiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
