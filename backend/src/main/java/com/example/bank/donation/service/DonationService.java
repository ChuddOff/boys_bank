package com.example.bank.donation.service;

import com.example.bank.account.entity.AccountType;
import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.donation.dto.CreateCampaignRequest;
import com.example.bank.donation.dto.DonateRequest;
import com.example.bank.donation.dto.DonationCampaignResponse;
import com.example.bank.donation.entity.DonationCampaign;
import com.example.bank.donation.repository.DonationCampaignRepository;
import com.example.bank.transaction.dto.TransactionResponse;
import com.example.bank.transaction.entity.BankTransaction;
import com.example.bank.transaction.entity.TransactionType;
import com.example.bank.transaction.repository.TransactionRepository;
import com.example.bank.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DonationService {

    private final DonationCampaignRepository donationCampaignRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionService transactionService;
    private final TransactionRepository transactionRepository;

    @Transactional
    public DonationCampaignResponse createCampaign(String email, CreateCampaignRequest request) {
        var account = bankAccountRepository.findById(request.targetAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Целевой счет не найден"));

        if (!account.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Можно создавать сбор только для своего счета");
        }

        account.setType(AccountType.DONATION);

        DonationCampaign campaign = DonationCampaign.builder()
                .title(request.title())
                .description(request.description())
                .category("Сбор пользователя")
                .sourceUrl("https://boys-bank.example/donations/user-campaigns")
                .impact("Перевод поступит на выбранный донатный счет пользователя Boys Bank.")
                .targetAccount(account)
                .active(true)
                .collectedAmount(BigDecimal.ZERO)
                .createdAt(LocalDateTime.now())
                .build();

        return map(donationCampaignRepository.save(campaign));
    }

    public List<DonationCampaignResponse> activeCampaigns() {
        return donationCampaignRepository.findByActiveTrueOrderByCreatedAtDesc().stream().map(this::map).toList();
    }

    @Transactional
    public TransactionResponse donate(String email, DonateRequest request) {
        transactionRepository.findByOperationId(request.operationId()).ifPresent(t -> {
            throw new IllegalArgumentException("Операция с таким operationId уже выполнена");
        });

        var from = bankAccountRepository.findWithLockById(request.fromAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Счет отправителя не найден"));
        var campaign = donationCampaignRepository.findById(request.campaignId())
                .orElseThrow(() -> new IllegalArgumentException("Сбор не найден"));

        if (!from.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Нельзя донатить с чужого счета");
        }
        if (!campaign.getActive()) {
            throw new IllegalArgumentException("Сбор неактивен");
        }
        if (!from.getActive()) {
            throw new IllegalArgumentException("Счет списания не активен");
        }
        if (from.getType() == AccountType.DONATION) {
            throw new IllegalArgumentException("С донатного счета нельзя переводить");
        }
        var to = bankAccountRepository.findWithLockById(campaign.getTargetAccount().getId())
                .orElseThrow(() -> new IllegalArgumentException("Счет получателя не найден"));
        if (!to.getActive()) {
            throw new IllegalArgumentException("Счет фонда не активен");
        }
        if (!from.getCurrency().equals(to.getCurrency())) {
            throw new IllegalArgumentException("Пожертвования между разными валютами не поддерживаются в учебной версии");
        }

        if (from.getBalance().compareTo(request.amount()) < 0) {
            throw new IllegalArgumentException("Недостаточно средств");
        }

        from.setBalance(from.getBalance().subtract(request.amount()));
        to.setBalance(to.getBalance().add(request.amount()));
        campaign.setCollectedAmount(campaign.getCollectedAmount().add(request.amount()));

        BankTransaction tx = BankTransaction.builder()
                .fromAccount(from)
                .toAccount(to)
                .amount(request.amount())
                .type(TransactionType.DONATION)
                .operationId(request.operationId())
                .description(request.message())
                .createdAt(LocalDateTime.now())
                .build();

        return transactionService.saveDonationTx(tx);
    }

    private DonationCampaignResponse map(DonationCampaign campaign) {
        return new DonationCampaignResponse(
                campaign.getId(),
                campaign.getTitle(),
                campaign.getDescription(),
                campaign.getCategory(),
                campaign.getSourceUrl(),
                campaign.getImpact(),
                campaign.getTargetAccount().getId(),
                campaign.getCollectedAmount(),
                campaign.getActive()
        );
    }
}
