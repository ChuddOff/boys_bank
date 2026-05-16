package com.example.bank.deposit.service;

import com.example.bank.account.entity.AccountType;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.deposit.dto.DepositResponse;
import com.example.bank.deposit.dto.OpenDepositRequest;
import com.example.bank.deposit.dto.DepositEstimateResponse;
import com.example.bank.deposit.entity.Deposit;
import com.example.bank.deposit.repository.DepositRepository;
import com.example.bank.product.service.ProductRateService;
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
    private final ProductRateService productRateService;

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
        validateAmountAndTerm(request.amount(), request.termMonths());
        if (account.getBalance().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Недостаточно средств на счете");
        }

        account.setBalance(account.getBalance().subtract(request.amount()));
        BigDecimal annualRate = productRateService.depositRateFor(request.amount(), request.termMonths());

        LocalDate openedAt = LocalDate.now();
        Deposit deposit = Deposit.builder()
                .account(account)
                .principal(request.amount())
                .annualRate(annualRate)
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

    public DepositEstimateResponse estimate(BigDecimal amount, Integer termMonths) {
        validateAmountAndTerm(amount, termMonths);
        BigDecimal annualRate = productRateService.depositRateFor(amount, termMonths);
        BigDecimal projectedPayout = calculateProjectedPayout(amount, annualRate, termMonths);
        return new DepositEstimateResponse(
                amount,
                termMonths,
                annualRate,
                LocalDate.now().plusMonths(termMonths),
                projectedPayout,
                projectedPayout.subtract(amount).setScale(2, RoundingMode.HALF_UP)
        );
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

    private void validateAmountAndTerm(BigDecimal amount, Integer months) {
        if (amount == null || amount.compareTo(BigDecimal.valueOf(1000)) < 0) {
            throw new IllegalArgumentException("Минимальная сумма вклада — 1000");
        }
        if (months == null || months < 1 || months > 120) {
            throw new IllegalArgumentException("Срок вклада должен быть от 1 до 120 месяцев");
        }
    }

    private BigDecimal calculateProjectedPayout(BigDecimal principal, BigDecimal annualRate, Integer months) {
        BigDecimal years = BigDecimal.valueOf(months).divide(BigDecimal.valueOf(12), 8, RoundingMode.HALF_UP);
        BigDecimal rate = annualRate.divide(BigDecimal.valueOf(100), 8, RoundingMode.HALF_UP);
        BigDecimal multiplier = BigDecimal.ONE.add(rate.multiply(years));
        return principal.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
}
