package com.example.bank.fraud.service;

import com.example.bank.ai.dto.FraudCheckRequest;
import com.example.bank.ai.service.FraudGatewayService;
import com.example.bank.fraud.dto.FraudReviewRequest;
import com.example.bank.fraud.dto.FraudTransactionResponse;
import com.example.bank.fraud.entity.FraudReview;
import com.example.bank.fraud.entity.FraudReviewStatus;
import com.example.bank.fraud.repository.FraudReviewRepository;
import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.entity.BankTransaction;
import com.example.bank.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FraudTransactionService {
    private final TransactionRepository transactionRepository;
    private final FraudGatewayService fraudGatewayService;
    private final FraudReviewRepository reviewRepository;

    public List<FraudTransactionResponse> suspicious(String email) {
        return transactionRepository.findByFromAccountOwnerEmailOrToAccountOwnerEmailOrderByCreatedAtDesc(email, email)
                .stream()
                .map(this::map)
                .filter(FraudTransactionResponse::suspicious)
                .toList();
    }

    public List<FraudTransactionResponse> all() {
        return transactionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::map)
                .toList();
    }

    public FraudTransactionResponse get(String email, Long id) {
        BankTransaction tx = findOwned(email, id);
        return map(tx);
    }

    @Transactional
    public FraudTransactionResponse review(String email, Long id, FraudReviewRequest request) {
        BankTransaction tx = findOwned(email, id);
        FraudReview review = reviewRepository.findByTransactionId(id).orElseGet(() -> FraudReview.builder()
                .transaction(tx)
                .status(FraudReviewStatus.NEW)
                .build());
        review.setStatus(request.status());
        review.setReviewerNote(request.note());
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
        return map(tx);
    }

    @Transactional
    public FraudTransactionResponse adminReview(Long id, FraudReviewRequest request) {
        BankTransaction tx = transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Транзакция не найдена"));
        FraudReview review = reviewRepository.findByTransactionId(id).orElseGet(() -> FraudReview.builder()
                .transaction(tx)
                .status(FraudReviewStatus.NEW)
                .build());
        review.setStatus(request.status());
        review.setReviewerNote(request.note());
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
        return map(tx);
    }

    private BankTransaction findOwned(String email, Long id) {
        BankTransaction tx = transactionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Транзакция не найдена"));
        boolean owned = (tx.getFromAccount() != null && tx.getFromAccount().getOwner().getEmail().equalsIgnoreCase(email))
                || (tx.getToAccount() != null && tx.getToAccount().getOwner().getEmail().equalsIgnoreCase(email));
        if (!owned) throw new SecurityException("Нет доступа к транзакции");
        return tx;
    }

    private FraudTransactionResponse map(BankTransaction tx) {
        String currency = tx.getFromAccount() != null ? tx.getFromAccount().getCurrency() : tx.getToAccount().getCurrency();
        var check = fraudGatewayService.check(new FraudCheckRequest(tx.getDescription() == null ? "" : tx.getDescription(), tx.getAmount(), currency));
        var review = reviewRepository.findByTransactionId(tx.getId()).orElse(null);
        var transaction = new TransactionResponse(tx.getId(), tx.getFromAccount() == null ? null : tx.getFromAccount().getId(), tx.getToAccount() == null ? null : tx.getToAccount().getId(), tx.getAmount(), tx.getType(), tx.getOperationId(), tx.getCreatedAt(), tx.getDescription());
        return new FraudTransactionResponse(tx.getId(), transaction, check.suspicious(), check.riskScore(), check.reason(), check.source(), review == null ? FraudReviewStatus.NEW : review.getStatus(), review == null ? null : review.getReviewerNote());
    }
}
