package com.example.bank.account.repository;

import com.example.bank.account.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
    List<BankAccount> findByOwnerEmail(String email);
    Optional<BankAccount> findByIban(String iban);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<BankAccount> findWithLockById(Long id);
}
