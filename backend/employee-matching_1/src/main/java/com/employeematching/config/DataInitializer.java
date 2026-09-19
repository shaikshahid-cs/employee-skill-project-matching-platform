package com.employeematching.config;

import com.employeematching.entity.Skill;
import com.employeematching.entity.SkillAlias;
import com.employeematching.entity.User;
import com.employeematching.repository.SkillAliasRepository;
import com.employeematching.repository.SkillRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;
    private final SkillAliasRepository skillAliasRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            SkillRepository skillRepository,
            SkillAliasRepository skillAliasRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.skillRepository = skillRepository;
        this.skillAliasRepository = skillAliasRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedSkillsAndAliases();
    }

    private void seedAdminUser() {
        if (userRepository.findByEmail("admin@matching.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@matching.com");
            admin.setPassword(passwordEncoder.encode("Admin@12345"));
            admin.setFullName("System Administrator");
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);
            admin.setMustChangePassword(false);
            userRepository.save(admin);
        }
    }

    private void seedSkillsAndAliases() {
        if (skillRepository.count() == 0) {
            // Map of Canonical Skill -> Category
            Map<String, String> skillsWithCategory = new LinkedHashMap<>();
            // Languages
            skillsWithCategory.put("Java", "Languages");
            skillsWithCategory.put("Python", "Languages");
            skillsWithCategory.put("JavaScript", "Languages");
            skillsWithCategory.put("TypeScript", "Languages");
            skillsWithCategory.put("C++", "Languages");
            skillsWithCategory.put("C#", "Languages");
            skillsWithCategory.put("Go", "Languages");
            skillsWithCategory.put("SQL", "Languages");
            skillsWithCategory.put("HTML", "Languages");
            skillsWithCategory.put("CSS", "Languages");

            // Frameworks & Libraries
            skillsWithCategory.put("Spring Boot", "Frameworks");
            skillsWithCategory.put("Spring MVC", "Frameworks");
            skillsWithCategory.put("Hibernate", "Frameworks");
            skillsWithCategory.put("JPA", "Frameworks");
            skillsWithCategory.put("React", "Frameworks");
            skillsWithCategory.put("Angular", "Frameworks");
            skillsWithCategory.put("Vue.js", "Frameworks");
            skillsWithCategory.put("Node.js", "Frameworks");
            skillsWithCategory.put("Express", "Frameworks");
            skillsWithCategory.put("Django", "Frameworks");
            skillsWithCategory.put("Flask", "Frameworks");
            skillsWithCategory.put("Redux", "Frameworks");
            skillsWithCategory.put("Tailwind CSS", "Frameworks");

            // Databases
            skillsWithCategory.put("MySQL", "Databases");
            skillsWithCategory.put("PostgreSQL", "Databases");
            skillsWithCategory.put("MongoDB", "Databases");
            skillsWithCategory.put("Oracle", "Databases");
            skillsWithCategory.put("Redis", "Databases");

            // Cloud & DevOps
            skillsWithCategory.put("AWS", "Cloud & DevOps");
            skillsWithCategory.put("Docker", "Cloud & DevOps");
            skillsWithCategory.put("Kubernetes", "Cloud & DevOps");
            skillsWithCategory.put("Git", "Cloud & DevOps");
            skillsWithCategory.put("CI/CD", "Cloud & DevOps");
            skillsWithCategory.put("Linux", "Cloud & DevOps");
            skillsWithCategory.put("Terraform", "Cloud & DevOps");
            skillsWithCategory.put("Jenkins", "Cloud & DevOps");

            // Architecture & Concepts
            skillsWithCategory.put("REST APIs", "Architecture");
            skillsWithCategory.put("Microservices", "Architecture");
            skillsWithCategory.put("System Design", "Architecture");
            skillsWithCategory.put("GraphQL", "Architecture");
            skillsWithCategory.put("Unit Testing", "Testing");
            skillsWithCategory.put("JUnit", "Testing");
            skillsWithCategory.put("Agile", "Methodologies");

            Map<String, Skill> savedSkills = new LinkedHashMap<>();
            for (Map.Entry<String, String> entry : skillsWithCategory.entrySet()) {
                Skill skill = new Skill(entry.getKey(), entry.getValue());
                savedSkills.put(entry.getKey(), skillRepository.save(skill));
            }

            // Seed Skill Aliases
            Map<String, List<String>> aliases = new LinkedHashMap<>();
            aliases.put("JavaScript", List.of("JS", "Vanilla JS", "ECMAScript"));
            aliases.put("TypeScript", List.of("TS"));
            aliases.put("React", List.of("ReactJS", "React.js"));
            aliases.put("Spring Boot", List.of("SpringBoot", "Spring-Boot"));
            aliases.put("PostgreSQL", List.of("Postgres", "Postgre"));
            aliases.put("Kubernetes", List.of("K8s", "K8"));
            aliases.put("AWS", List.of("Amazon Web Services", "Amazon AWS", "AWS EC2"));
            aliases.put("Node.js", List.of("NodeJS", "Node"));
            aliases.put("MongoDB", List.of("Mongo"));
            aliases.put("REST APIs", List.of("REST", "RESTful", "REST API", "RESTful APIs"));

            for (Map.Entry<String, List<String>> entry : aliases.entrySet()) {
                Skill canonicalSkill = savedSkills.get(entry.getKey());
                if (canonicalSkill != null) {
                    for (String alias : entry.getValue()) {
                        SkillAlias sa = new SkillAlias(alias, canonicalSkill);
                        skillAliasRepository.save(sa);
                    }
                }
            }
        }
    }
}
