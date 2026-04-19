package com.example.bank.transaction.service;

import com.example.bank.account.entity.AccountType;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.dto.TransferRequest;
import com.example.bank.transaction.entity.BankTransaction;
import com.example.bank.transaction.entity.TransactionType;
import com.example.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public TransactionResponse transfer(String email, TransferRequest request) {
        transactionRepository.findByOperationId(request.operationId()).ifPresent(t -> {
            throw new IllegalArgumentException("Операция с таким operationId уже выполнена");
        });

        var from = bankAccountRepository.findWithLockById(request.fromAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Счет отправителя не найден"));
        var to = bankAccountRepository.findByIban(request.toIban())
                .orElseThrow(() -> new IllegalArgumentException("Счет получателя не найден"));

        if (!from.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Нельзя переводить с чужого счета");
        }
        if (!from.getActive() || !to.getActive()) {
            throw new IllegalArgumentException("Счет не активен");
        }
        if (from.getCurrency().equals(to.getCurrency())) {
            // ok
        } else {
            throw new IllegalArgumentException("Переводы между разными валютами не поддерживаются в учебной версии");
        }
        if (from.getType() == AccountType.DONATION) {
            throw new IllegalArgumentException("С донатного счета нельзя переводить");
        }
        if (from.getBalance().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Недостаточно средств");
        }

        var lockOrder = List.of(from.getId(), to.getId()).stream().sorted(Comparator.naturalOrder()).toList();
        for (Long id : lockOrder) {
            bankAccountRepository.findWithLockById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Счет не найден"));
        }

        from.setBalance(from.getBalance().subtract(request.amount()));
        to.setBalance(to.getBalance().add(request.amount()));

        var tx = BankTransaction.builder()
                .fromAccount(from)
                .toAccount(to)
                .amount(request.amount())
                .type(TransactionType.TRANSFER)
                .operationId(request.operationId())
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .build();

        return map(transactionRepository.save(tx));
    }

    public List<TransactionResponse> history(String email) {
        return transactionRepository
                .findByFromAccountOwnerEmailOrToAccountOwnerEmailOrderByCreatedAtDesc(email, email)
                .stream().map(this::map).toList();
    }

    public TransactionResponse saveDonationTx(BankTransaction tx) {
        return map(transactionRepository.save(tx));
    }

    private TransactionResponse map(BankTransaction tx) {
        return new TransactionResponse(
                tx.getId(),
                tx.getFromAccount() != null ? tx.getFromAccount().getId() : null,
                tx.getToAccount() != null ? tx.getToAccount().getId() : null,
                tx.getAmount(),
                tx.getType(),
                tx.getOperationId(),
                tx.getCreatedAt(),
                tx.getDescription()
        );
    }
}
