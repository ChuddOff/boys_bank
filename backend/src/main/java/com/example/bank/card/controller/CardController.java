package com.example.bank.card.controller;

import com.example.bank.card.dto.CardResponse;
import com.example.bank.card.dto.CreateCardRequest;
import com.example.bank.card.entity.CardStatus;
import com.example.bank.card.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {
    private final CardService cardService;

    @GetMapping
    public List<CardResponse> cards(Authentication authentication) {
        return cardService.cards(authentication.getName());
    }

    @PostMapping
    public CardResponse create(Authentication authentication, @Valid @RequestBody CreateCardRequest request) {
        return cardService.create(authentication.getName(), request);
    }

    @PatchMapping("/{id}/block")
    public CardResponse block(Authentication authentication, @PathVariable Long id) {
        return cardService.setStatus(authentication.getName(), id, CardStatus.BLOCKED);
    }

    @PatchMapping("/{id}/unblock")
    public CardResponse unblock(Authentication authentication, @PathVariable Long id) {
        return cardService.setStatus(authentication.getName(), id, CardStatus.ACTIVE);
    }
}
