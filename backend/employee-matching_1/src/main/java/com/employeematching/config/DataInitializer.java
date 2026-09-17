package com.employeematching.config;

import com.employeematching.entity.Skill;
import com.employeematching.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SkillRepository skillRepository;

    public DataInitializer(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Override
    public void run(String... args) {
        if (skillRepository.count() == 0) {
            List<String> defaultSkills = List.of(
                "Java",
                "Spring Boot",
                "Spring MVC",
                "Hibernate",
                "JPA",
                "React",
                "JavaScript",
                "TypeScript",
                "HTML",
                "CSS",
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "REST APIs",
                "GraphQL",
                "Python",
                "Docker",
                "Kubernetes",
                "AWS",
                "Git",
                "Microservices",
                "System Design",
                "Node.js",
                "Express",
                "Redux",
                "Tailwind CSS",
                "Unit Testing",
                "JUnit",
                "CI/CD",
                "Linux",
                "Agile"
            );

            for (String name : defaultSkills) {
                Skill skill = new Skill();
                skill.setName(name);
                skillRepository.save(skill);
            }
        }
    }
}
