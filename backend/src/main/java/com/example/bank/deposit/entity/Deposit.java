package com.example.bank.deposit.entity;

import com.example.bank.account.entity.BankAccount;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "deposits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "account_id", unique = true)
    private BankAccount account;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal principal;

    @Column(nullable = false, precision = 6, scale = 4)
    private BigDecimal annualRate;

    @Column(nullable = false)
    @Builder.Default
    private String productName = "Boys Classic";

    @Column(nullable = false)
    @Builder.Default
    private Boolean capitalization = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean earlyWithdrawal = false;

    @Column(nullable = false)
    private Integer termMonths;

    @Column(nullable = false)
    private LocalDate openedAt;

    @Column(nullable = false)
    private LocalDate maturityDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
