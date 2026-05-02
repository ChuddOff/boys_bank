package com.example.bank.ai.controller;

import com.example.bank.ai.dto.FraudCheckRequest;
import com.example.bank.ai.dto.FraudCheckResponse;
import com.example.bank.ai.service.FraudGatewayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fraud")
@RequiredArgsConstructor
public class FraudController {

    private final FraudGatewayService fraudGatewayService;

    @PostMapping("/check")
    public FraudCheckResponse check(@Valid @RequestBody FraudCheckRequest request) {
        return fraudGatewayService.check(request);
    }
}
