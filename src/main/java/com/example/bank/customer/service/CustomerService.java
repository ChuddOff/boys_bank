package com.example.bank.customer.service;

import com.example.bank.customer.dto.AuthRequest;
import com.example.bank.customer.dto.AuthResponse;
import com.example.bank.customer.dto.RegisterRequest;
import com.example.bank.customer.entity.Customer;
import com.example.bank.customer.entity.Role;
import com.example.bank.customer.repository.CustomerRepository;
import com.example.bank.customer.repository.RoleRepository;
import com.example.bank.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        customerRepository.findByEmail(request.email()).ifPresent(c -> {
            throw new IllegalArgumentException("Пользователь с таким email уже существует");
        });

        Role role = roleRepository.findByName("CLIENT")
                .orElseThrow(() -> new IllegalStateException("Роль CLIENT не найдена"));

        Customer customer = Customer.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .roles(Set.of(role))
                .createdAt(LocalDateTime.now())
                .build();

        customerRepository.save(customer);
        String token = jwtService.generateToken(customer.getEmail());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        String token = jwtService.generateToken(request.email());
        return new AuthResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }
}
