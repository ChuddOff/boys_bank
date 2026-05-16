package com.example.bank.card.repository;

import com.example.bank.card.entity.BankCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BankCardRepository extends JpaRepository<BankCard, Long> {
    List<BankCard> findByAccountOwnerEmailOrderByCreatedAtDesc(String email);
}
