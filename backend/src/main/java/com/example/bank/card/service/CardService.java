package com.example.bank.card.service;

import com.example.bank.account.repository.BankAccountRepository;
import com.example.bank.card.dto.CardResponse;
import com.example.bank.card.dto.CreateCardRequest;
import com.example.bank.card.entity.BankCard;
import com.example.bank.card.entity.CardStatus;
import com.example.bank.card.repository.BankCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CardService {
    private final BankCardRepository cardRepository;
    private final BankAccountRepository accountRepository;
    private final Random random = new Random();

    public List<CardResponse> cards(String email) {
        return cardRepository.findByAccountOwnerEmailOrderByCreatedAtDesc(email).stream().map(this::map).toList();
    }

    @Transactional
    public CardResponse create(String email, CreateCardRequest request) {
        var account = accountRepository.findById(request.accountId())
                .orElseThrow(() -> new IllegalArgumentException("Счет не найден"));
        if (!account.getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Нет доступа к счету");
        }
        BankCard card = BankCard.builder()
                .account(account)
                .maskedNumber("2200 **** **** " + (1000 + random.nextInt(9000)))
                .expiresAt(LocalDate.now().plusYears(4))
                .status(CardStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();
        return map(cardRepository.save(card));
    }

    @Transactional
    public CardResponse setStatus(String email, Long id, CardStatus status) {
        BankCard card = cardRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Карта не найдена"));
        if (!card.getAccount().getOwner().getEmail().equalsIgnoreCase(email)) {
            throw new SecurityException("Нет доступа к карте");
        }
        card.setStatus(status);
        return map(card);
    }

    private CardResponse map(BankCard card) {
        return new CardResponse(card.getId(), card.getAccount().getId(), card.getMaskedNumber(), card.getExpiresAt(), card.getStatus());
    }
}
