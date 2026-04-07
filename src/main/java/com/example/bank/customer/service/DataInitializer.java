package com.example.bank.customer.service;

import com.example.bank.customer.entity.Role;
import com.example.bank.customer.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        createRoleIfNotExists("CLIENT");
        createRoleIfNotExists("ADMIN");
    }

    private void createRoleIfNotExists(String roleName) {
        roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(roleName).build()
                ));
    }
}