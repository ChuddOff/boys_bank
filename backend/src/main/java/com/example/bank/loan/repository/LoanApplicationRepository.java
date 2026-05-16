package com.example.bank.loan.repository;

import com.example.bank.loan.entity.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {
    List<LoanApplication> findByCustomerEmailOrderByCreatedAtDesc(String email);
}
