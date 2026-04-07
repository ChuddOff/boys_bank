package com.example.bank.customer.service;

import com.example.bank.customer.dto.RegisterRequest;
import com.example.bank.customer.entity.Customer;
import com.example.bank.customer.entity.Role;
import com.example.bank.customer.repository.CustomerRepository;
import com.example.bank.customer.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;

    public void register(RegisterRequest request) {

        if (customerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        Role role = roleRepository.findByName("CLIENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Customer customer = Customer.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword()) // пока без шифрования
                .roles(Set.of(role))
                .createdAt(LocalDateTime.now())
                .build();

        customerRepository.save(customer);
    }
}