package com.example.bank.deposit.service;

import com.example.bank.account.entity.AccountType;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.deposit.dto.DepositResponse;
import com.example.bank.deposit.dto.OpenDepositRequest;
import com.example.bank.deposit.entity.Deposit;
import com.example.bank.deposit.repository.DepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepositService {

    private final DepositRepository depositRepository;
    private final BankAccountRepository bankAccountRepository;

    @Transactional
    public DepositResponse openDeposit(String email, OpenDepositRequest request) {
        var account = bankAccountRepository.findWithLockById(request.sourceAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Счет не найден"));

        if (!account.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Счет не принадлежит пользователю");
        }
        if (account.getType() == AccountType.DONATION) {
            throw new IllegalArgumentException("Донатный счет нельзя использовать для вклада");
        }
        if (request.termMonths() < 1 || request.termMonths() > 120) {
            throw new IllegalArgumentException("Срок вклада должен быть от 1 до 120 месяцев");
        }
        if (account.getBalance().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Недостаточно средств на счете");
        }

        account.setBalance(account.getBalance().subtract(request.amount()));

        LocalDate openedAt = LocalDate.now();
        Deposit deposit = Deposit.builder()
                .account(account)
                .principal(request.amount())
                .annualRate(request.annualRate())
                .termMonths(request.termMonths())
                .openedAt(openedAt)
                .maturityDate(openedAt.plusMonths(request.termMonths()))
                .active(true)
                .build();

        return map(depositRepository.save(deposit));
    }

    public List<DepositResponse> myDeposits(String email) {
        return depositRepository.findByAccountOwnerEmail(email).stream().map(this::map).toList();
    }

    private DepositResponse map(Deposit deposit) {
        BigDecimal projected = calculateProjectedPayout(deposit.getPrincipal(), deposit.getAnnualRate(), deposit.getTermMonths());
        return new DepositResponse(
                deposit.getId(),
                deposit.getAccount().getId(),
                deposit.getPrincipal(),
                deposit.getAnnualRate(),
                deposit.getTermMonths(),
                deposit.getOpenedAt(),
                deposit.getMaturityDate(),
                projected,
                deposit.getActive()
        );
    }

    private BigDecimal calculateProjectedPayout(BigDecimal principal, BigDecimal annualRate, Integer months) {
        BigDecimal years = BigDecimal.valueOf(months).divide(BigDecimal.valueOf(12), 8, RoundingMode.HALF_UP);
        BigDecimal multiplier = BigDecimal.ONE.add(annualRate.multiply(years));
        return principal.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
}
