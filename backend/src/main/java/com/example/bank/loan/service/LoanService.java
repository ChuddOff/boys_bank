package com.example.bank.loan.service;

import com.example.bank.customer.repository.CustomerRepository;
import com.example.bank.loan.dto.LoanApplicationRequest;
import com.example.bank.loan.dto.LoanApplicationResponse;
import com.example.bank.loan.entity.LoanApplication;
import com.example.bank.loan.entity.LoanApplicationStatus;
import com.example.bank.loan.repository.LoanApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {
    private final LoanApplicationRepository repository;
    private final CustomerRepository customerRepository;

    public List<LoanApplicationResponse> loans(String email) {
        return repository.findByCustomerEmailOrderByCreatedAtDesc(email).stream().map(this::map).toList();
    }

    @Transactional
    public LoanApplicationResponse apply(String email, LoanApplicationRequest request) {
        if (request.termMonths() == null || request.termMonths() < 1 || request.termMonths() > 120) {
            throw new IllegalArgumentException("Срок кредита должен быть от 1 до 120 месяцев");
        }
        var customer = customerRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
        var loan = LoanApplication.builder()
                .customer(customer)
                .amount(request.amount())
                .termMonths(request.termMonths())
                .annualRate(request.annualRate() == null ? BigDecimal.valueOf(18.0) : request.annualRate())
                .purpose(request.purpose())
                .status(LoanApplicationStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        return map(repository.save(loan));
    }

    private LoanApplicationResponse map(LoanApplication loan) {
        return new LoanApplicationResponse(loan.getId(), loan.getAmount(), loan.getTermMonths(), loan.getAnnualRate(), loan.getPurpose(), loan.getStatus(), loan.getCreatedAt());
    }
}
