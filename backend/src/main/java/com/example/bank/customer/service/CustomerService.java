package com.example.bank.customer.service;

import com.example.bank.customer.dto.AuthRequest;
import com.example.bank.customer.dto.AuthResponse;
import com.example.bank.customer.dto.RegisterRequest;
import com.example.bank.customer.dto.UserResponse;
import com.example.bank.profile.dto.UpdateProfileRequest;
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
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

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

        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Роль USER не найдена"));

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
        String token = jwtService.generateToken(request.email().toLowerCase(Locale.ROOT));
        return new AuthResponse(token, "Bearer", jwtService.getExpirationSeconds());
    }

    public UserResponse me(String email) {
        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
        return map(customer);
    }

    public java.util.List<UserResponse> users() {
        return customerRepository.findAll().stream().map(this::map).toList();
    }

    public UserResponse user(Long id) {
        return customerRepository.findById(id).map(this::map)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
    }

    @Transactional
    public UserResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        Customer customer = customerRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
        String newEmail = request.email().toLowerCase(Locale.ROOT);
        customerRepository.findByEmail(newEmail).ifPresent(existing -> {
            if (!existing.getId().equals(customer.getId())) {
                throw new IllegalArgumentException("Email уже занят");
            }
        });
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(newEmail);
        customer.setPhone(request.phone());
        customer.setCity(request.city());
        customer.setAddressLine(request.addressLine());
        customer.setPassportNumber(request.passportNumber());
        customer.setPassportIssuedBy(request.passportIssuedBy());
        customer.setEmployer(request.employer());
        customer.setJobTitle(request.jobTitle());
        customer.setMonthlyIncome(request.monthlyIncome());
        customer.setTwoFactorEnabled(Boolean.TRUE.equals(request.twoFactorEnabled()));
        customer.setPushNotifications(!Boolean.FALSE.equals(request.pushNotifications()));
        customer.setMarketingNotifications(Boolean.TRUE.equals(request.marketingNotifications()));
        return map(customer);
    }

    @Transactional
    public UserResponse updateRole(Long id, String roleName) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Клиент не найден"));
        Role role = roleRepository.findByName(normalizeRole(roleName))
                .orElseThrow(() -> new IllegalArgumentException("Роль не найдена"));
        customer.setRoles(Set.of(role));
        return map(customer);
    }

    private String normalizeRole(String roleName) {
        String normalized = roleName.toUpperCase(Locale.ROOT);
        return normalized.equals("CLIENT") ? "USER" : normalized;
    }

    private UserResponse map(Customer customer) {
        return new UserResponse(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                customer.getCreatedAt(),
                customer.getPhone(),
                customer.getCity(),
                customer.getAddressLine(),
                customer.getPassportNumber(),
                customer.getPassportIssuedBy(),
                customer.getEmployer(),
                customer.getJobTitle(),
                customer.getMonthlyIncome(),
                customer.getTwoFactorEnabled(),
                customer.getPushNotifications(),
                customer.getMarketingNotifications()
        );
    }
}
