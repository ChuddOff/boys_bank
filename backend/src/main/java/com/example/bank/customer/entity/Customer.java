package com.example.bank.customer.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String city;
    private String addressLine;
    private String passportNumber;
    private String passportIssuedBy;
    private String employer;
    private String jobTitle;
    private java.math.BigDecimal monthlyIncome;

    @Column(nullable = false)
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean pushNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean marketingNotifications = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "customer_roles",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    private LocalDateTime createdAt;
}