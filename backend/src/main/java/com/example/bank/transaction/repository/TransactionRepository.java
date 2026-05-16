package com.example.bank.transaction.repository;

import com.example.bank.transaction.entity.BankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<BankTransaction, Long> {
    List<BankTransaction> findByFromAccountOwnerEmailOrToAccountOwnerEmailOrderByCreatedAtDesc(String fromEmail, String toEmail);
    Optional<BankTransaction> findByOperationId(String operationId);
    List<BankTransaction> findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(Long fromAccountId, Long toAccountId);
    List<BankTransaction> findAllByOrderByCreatedAtDesc();
}
