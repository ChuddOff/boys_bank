package com.example.bank.deposit.repository;

import com.example.bank.deposit.entity.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepositRepository extends JpaRepository<Deposit, Long> {
    List<Deposit> findByAccountOwnerEmail(String email);
}
