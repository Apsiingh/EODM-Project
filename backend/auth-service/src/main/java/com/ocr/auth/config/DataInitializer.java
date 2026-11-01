package com.ocr.auth.config;

import com.ocr.auth.entity.Role;
import com.ocr.auth.entity.User;
import com.ocr.auth.repository.RoleRepository;
import com.ocr.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final String adminPassword;
    private final String userPassword;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           @org.springframework.beans.factory.annotation.Value("${seed.admin-password:password123}") String adminPassword,
                           @org.springframework.beans.factory.annotation.Value("${seed.user-password:password123}") String userPassword) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminPassword = adminPassword;
        this.userPassword = userPassword;
    }

    @Override
    public void run(String... args) {
        // Initialize default roles
        Role adminRole = getOrCreateRole("ROLE_ADMIN");
        Role managerRole = getOrCreateRole("ROLE_MANAGER");
        Role financeRole = getOrCreateRole("ROLE_FINANCE");
        Role auditorRole = getOrCreateRole("ROLE_AUDITOR");
        Role operatorRole = getOrCreateRole("ROLE_OPERATOR");
        Role userRole = getOrCreateRole("ROLE_USER");

        // Seed default corporate users if none exist
        seedUserIfNotExists("alex.wright", "alex.wright@enterprise.com", adminPassword, "Admin User", Set.of(adminRole));
        seedUserIfNotExists("john.manager", "john.manager@enterprise.com", userPassword, "Manager Approval", Set.of(managerRole));
        seedUserIfNotExists("jane.finance", "jane.finance@enterprise.com", userPassword, "Finance Approval", Set.of(financeRole));
        seedUserIfNotExists("m.auditor", "m.auditor@enterprise.com", userPassword, "Compliance Auditor", Set.of(auditorRole));
        seedUserIfNotExists("s.vendor", "s.vendor@abcpvtltd.com", userPassword, "Vendor User", Set.of(userRole, operatorRole));

        log.info("Default roles and users pre-seeded successfully.");
    }

    private Role getOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
    }

    private void seedUserIfNotExists(String username, String email, String rawPassword, String designation, Set<Role> roles) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User(username, email, passwordEncoder.encode(rawPassword), designation);
            user.setRoles(roles);
            userRepository.save(user);
            log.info("Pre-seeded user: {} ({}) with password '{}'", username, email, rawPassword);
        }
    }
}
