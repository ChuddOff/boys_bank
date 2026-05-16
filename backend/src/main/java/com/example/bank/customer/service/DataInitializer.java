package com.example.bank.customer.service;

import com.example.bank.account.entity.AccountType;
import com.example.bank.account.entity.BankAccount;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.customer.entity.Customer;
import com.example.bank.customer.entity.Role;
import com.example.bank.customer.repository.CustomerRepository;
import com.example.bank.customer.repository.RoleRepository;
import com.example.bank.transaction.entity.BankTransaction;
import com.example.bank.transaction.entity.TransactionType;
import com.example.bank.transaction.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final CustomerRepository customerRepository;
    private final BankAccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    @PostConstruct
    @Transactional
    public void init() {
        Role user = createRoleIfNotExists("USER");
        Role admin = createRoleIfNotExists("ADMIN");
        Customer demo = createCustomerIfNotExists("demo@boys.bank", "Demo", "User", user);
        Customer adminUser = createCustomerIfNotExists("admin@boys.bank", "Admin", "Bank", admin);
        BankAccount demoAccount = createAccountIfNotExists(demo, "RU00BANK000000001", AccountType.CURRENT, BigDecimal.valueOf(125000));
        BankAccount savings = createAccountIfNotExists(demo, "RU00BANK000000002", AccountType.SAVINGS, BigDecimal.valueOf(450000));
        BankAccount adminAccount = createAccountIfNotExists(adminUser, "RU00BANK000000003", AccountType.CURRENT, BigDecimal.valueOf(90000));
        if (transactionRepository.findByFromAccountOwnerEmailOrToAccountOwnerEmailOrderByCreatedAtDesc(demo.getEmail(), demo.getEmail()).isEmpty()) {
            transactionRepository.save(BankTransaction.builder()
                    .fromAccount(demoAccount)
                    .toAccount(adminAccount)
                    .amount(BigDecimal.valueOf(42000))
                    .type(TransactionType.TRANSFER)
                    .operationId(UUID.randomUUID().toString())
                    .description("Срочно перевод за crypto консультацию")
                    .createdAt(LocalDateTime.now().minusDays(1))
                    .build());
            transactionRepository.save(BankTransaction.builder()
                    .fromAccount(adminAccount)
                    .toAccount(savings)
                    .amount(BigDecimal.valueOf(7500))
                    .type(TransactionType.TRANSFER)
                    .operationId(UUID.randomUUID().toString())
                    .description("Возврат за обед")
                    .createdAt(LocalDateTime.now().minusHours(8))
                    .build());
        }
    }

    private Role createRoleIfNotExists(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));
    }

    private Customer createCustomerIfNotExists(String email, String firstName, String lastName, Role role) {
        return customerRepository.findByEmail(email).orElseGet(() -> customerRepository.save(Customer.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode("password"))
                .roles(Set.of(role))
                .createdAt(LocalDateTime.now())
                .build()));
    }

    private BankAccount createAccountIfNotExists(Customer owner, String iban, AccountType type, BigDecimal balance) {
        return accountRepository.findByIban(iban).orElseGet(() -> accountRepository.save(BankAccount.builder()
                .owner(owner)
                .iban(iban)
                .type(type)
                .currency("RUB")
                .balance(balance)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build()));
    }
}
