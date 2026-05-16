package com.example.bank.account.service;

import com.example.bank.account.dto.AccountResponse;
import com.example.bank.account.dto.CreateAccountRequest;
import com.example.bank.account.entity.AccountType;
import com.example.bank.account.entity.BankAccount;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final BankAccountRepository bankAccountRepository;
    private final CustomerRepository customerRepository;
    private final Random random = new Random();

    @Transactional
    public AccountResponse create(String ownerEmail, CreateAccountRequest request) {
        var owner = customerRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));

        String currency = request.currency() == null ? "RUB" : request.currency().toUpperCase(Locale.ROOT);
        AccountType type = request.type() == null ? AccountType.CURRENT : request.type();
        String productName = normalizeAccountProduct(request.productName(), type);
        String packageName = request.packageName() == null || request.packageName().isBlank() ? "Стандарт" : request.packageName().trim();

        var account = BankAccount.builder()
                .owner(owner)
                .type(type)
                .currency(currency)
                .productName(productName)
                .packageName(packageName)
                .monthlyTransfersLimit(monthlyLimitFor(productName))
                .createdAt(LocalDateTime.now())
                .balance(BigDecimal.ZERO)
                .active(true)
                .iban(generateIban())
                .build();

        return map(bankAccountRepository.save(account));
    }

    public List<AccountResponse> myAccounts(String ownerEmail) {
        return bankAccountRepository.findByOwnerEmail(ownerEmail).stream().map(this::map).toList();
    }

    public AccountResponse get(String ownerEmail, Long accountId) {
        return map(getOwnedAccount(ownerEmail, accountId));
    }

    @Transactional
    public AccountResponse topUp(String ownerEmail, Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сумма пополнения должна быть положительной");
        }
        BankAccount account = getOwnedAccount(ownerEmail, accountId);
        account.setBalance(account.getBalance().add(amount));
        return map(account);
    }

    @Transactional
    public AccountResponse withdraw(String ownerEmail, Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Сумма списания должна быть положительной");
        }
        BankAccount account = getOwnedAccount(ownerEmail, accountId);
        if (account.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Недостаточно средств");
        }
        account.setBalance(account.getBalance().subtract(amount));
        return map(account);
    }

    public BankAccount getOwnedAccount(String ownerEmail, Long accountId) {
        BankAccount account = bankAccountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("Счет не найден"));
        if (!account.getOwner().getEmail().equalsIgnoreCase(ownerEmail)) {
            throw new SecurityException("Нет доступа к счету");
        }
        return account;
    }

    private AccountResponse map(BankAccount account) {
        return new AccountResponse(
                account.getId(),
                account.getIban(),
                account.getType(),
                account.getBalance(),
                account.getCurrency(),
                account.getActive(),
                account.getProductName(),
                account.getPackageName(),
                account.getMonthlyTransfersLimit()
        );
    }

    private String normalizeAccountProduct(String requested, AccountType type) {
        if (requested == null || requested.isBlank()) {
            return switch (type) {
                case SAVINGS -> "Boys Save";
                case DONATION -> "Boys Charity";
                default -> "Boys Everyday";
            };
        }
        return requested.trim();
    }

    private Integer monthlyLimitFor(String productName) {
        String normalized = productName.toLowerCase(Locale.ROOT);
        if (normalized.contains("premium") || normalized.contains("platinum")) {
            return 300;
        }
        if (normalized.contains("save") || normalized.contains("накоп")) {
            return 25;
        }
        return 100;
    }

    private String generateIban() {
        return "RU" + (10 + random.nextInt(90)) + "BANK" + (100000000L + Math.abs(random.nextLong() % 900000000L));
    }
}
