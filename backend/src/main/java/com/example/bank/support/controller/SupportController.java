package com.example.bank.support.controller;

import com.example.bank.support.dto.SupportMessageRequest;
import com.example.bank.support.dto.SupportMessageResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    @PostMapping("/chat")
    public SupportMessageResponse chat(Authentication authentication, @Valid @RequestBody SupportMessageRequest request) {
        String reply = "Здравствуйте, " + authentication.getName() + ". Мы получили ваше сообщение: '" + request.message() +
                "'. Учебный саппорт ответит в ближайшее время.";
        return new SupportMessageResponse("accepted", reply);
    }
}
