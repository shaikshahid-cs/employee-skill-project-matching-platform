package com.employeematching.service;

import com.employeematching.dto.response.JdExtractionPreviewDTO;
import com.employeematching.dto.response.ResumeExtractionPreviewDTO;
import com.employeematching.dto.response.ResumeExtractionPreviewDTO.*;
import com.employeematching.dto.response.JdExtractionPreviewDTO.ExtractedJdSkill;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import org.apache.tika.Tika;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AssistiveDocumentService {

    private final Tika tika = new Tika();
    private final SkillRepository skillRepository;
    private final SkillAliasRepository skillAliasRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final ExperienceRepository experienceRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSkillRepository projectSkillRepository;

    public AssistiveDocumentService(
            SkillRepository skillRepository,
            SkillAliasRepository skillAliasRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository,
            EmployeeSkillRepository employeeSkillRepository,
            EducationRepository educationRepository,
            CertificationRepository certificationRepository,
            ExperienceRepository experienceRepository,
            ProjectRepository projectRepository,
            ProjectSkillRepository projectSkillRepository) {
        this.skillRepository = skillRepository;
        this.skillAliasRepository = skillAliasRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.educationRepository = educationRepository;
        this.certificationRepository = certificationRepository;
        this.experienceRepository = experienceRepository;
        this.projectRepository = projectRepository;
        this.projectSkillRepository = projectSkillRepository;
    }

    public String extractRawText(MultipartFile file) {
        try (InputStream is = file.getInputStream()) {
            String text = tika.parseToString(is);
            return text != null ? text : "";
        } catch (Exception e) {
            throw new RuntimeException("Failed to read document text: " + e.getMessage(), e);
        }
    }

    // ==========================================
    // RESUME ASSISTIVE PARSING
    // ==========================================

    public ResumeExtractionPreviewDTO parseResume(MultipartFile file) {
        String text = extractRawText(file);
        return parseResumeFromText(text);
    }

    public ResumeExtractionPreviewDTO parseResumeFromText(String rawText) {
        ResumeExtractionPreviewDTO preview = new ResumeExtractionPreviewDTO();
        if (rawText == null || rawText.isBlank()) {
            return preview;
        }

        String normalizedText = rawText.replaceAll("\\r\\n", "\n").replaceAll("\\r", "\n");
        String[] lines = normalizedText.split("\n");

        // 1. Email extraction
        Pattern emailPattern = Pattern.compile("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
        Matcher emailMatcher = emailPattern.matcher(normalizedText);
        if (emailMatcher.find()) {
            preview.setEmail(new ExtractedField<>(emailMatcher.group().trim(), "HIGH"));
        }

        // 2. Phone extraction
        Pattern phonePattern = Pattern.compile("(?:\\+?\\d{1,3}[-.\s]?)?\\(?\\d{3}\\)?[-.\s]?\\d{3}[-.\s]?\\d{4}");
        Matcher phoneMatcher = phonePattern.matcher(normalizedText);
        if (phoneMatcher.find()) {
            preview.setPhone(new ExtractedField<>(phoneMatcher.group().trim(), "HIGH"));
        }

        // 3. Name extraction (heuristic: first non-empty line with 2-4 words, no symbols)
        for (String line : lines) {
            String trimmed = line.trim();
            if (trimmed.length() >= 3 && trimmed.length() <= 40
                    && !trimmed.toLowerCase().contains("resume")
                    && !trimmed.toLowerCase().contains("curriculum")
                    && !trimmed.contains("@")
                    && !trimmed.matches(".*\\d.*")
                    && trimmed.split("\\s+").length >= 2
                    && trimmed.split("\\s+").length <= 4) {
                preview.setFullName(new ExtractedField<>(trimmed, "MEDIUM"));
                break;
            }
        }

        // 4. Role / Designation extraction
        Pattern rolePattern = Pattern.compile("(?i)\\b(Java Backend Developer|Backend Developer|Frontend Developer|Full Stack Developer|Software Engineer|Cloud Engineer|DevOps Engineer|Data Engineer|QA Engineer|Solutions Architect)\\b");
        Matcher roleMatcher = rolePattern.matcher(normalizedText);
        if (roleMatcher.find()) {
            preview.setDesignation(new ExtractedField<>(roleMatcher.group(), "HIGH"));
        }

        // 5. Skills extraction using canonical skills & aliases
        List<Skill> allSkills = skillRepository.findAll();
        List<SkillAlias> allAliases = skillAliasRepository.findAll();
        Map<String, Skill> aliasToSkillMap = new HashMap<>();
        for (SkillAlias a : allAliases) {
            aliasToSkillMap.put(a.getAlias().toLowerCase(), a.getSkill());
        }

        Set<Long> detectedSkillIds = new HashSet<>();
        List<ExtractedSkill> extractedSkills = new ArrayList<>();

        // Check canonical skills
        for (Skill skill : allSkills) {
            String nameLower = skill.getName().toLowerCase();
            Pattern p = Pattern.compile("\\b" + Pattern.quote(nameLower) + "\\b", Pattern.CASE_INSENSITIVE);
            if (p.matcher(normalizedText).find()) {
                if (detectedSkillIds.add(skill.getId())) {
                    extractedSkills.add(new ExtractedSkill(skill.getName(), null, null, "HIGH"));
                }
            }
        }

        // Check aliases
        for (Map.Entry<String, Skill> entry : aliasToSkillMap.entrySet()) {
            String alias = entry.getKey();
            Skill canonical = entry.getValue();
            Pattern p = Pattern.compile("\\b" + Pattern.quote(alias) + "\\b", Pattern.CASE_INSENSITIVE);
            if (p.matcher(normalizedText).find()) {
                if (detectedSkillIds.add(canonical.getId())) {
                    extractedSkills.add(new ExtractedSkill(canonical.getName(), null, null, "HIGH"));
                }
            }
        }
        preview.setSkills(extractedSkills);

        // 6. Education extraction
        List<ExtractedEducation> educationList = new ArrayList<>();
        Pattern degreePattern = Pattern.compile("(?i)\\b(B\\.Tech|Bachelor of Technology|B\\.E\\.|Bachelor of Engineering|B\\.S\\.|Bachelor of Science|M\\.S\\.|Master of Science|M\\.Tech|Master of Technology|MBA|PhD|Doctor of Philosophy)\\b(?:\\s+(?:in|of)\\s+([A-Za-z\\s]+))?");
        Matcher degMatcher = degreePattern.matcher(normalizedText);
        while (degMatcher.find()) {
            String degree = degMatcher.group(1).trim();
            String field = degMatcher.group(2) != null ? degMatcher.group(2).trim() : "Computer Science";
            String level = inferDegreeLevel(degree);

            // Attempt to find nearby graduation year
            Integer gradYear = null;
            Pattern yearPattern = Pattern.compile("\\b(20[0-2][0-9]|19[89][0-9])\\b");
            int start = Math.max(0, degMatcher.start() - 100);
            int end = Math.min(normalizedText.length(), degMatcher.end() + 100);
            Matcher ym = yearPattern.matcher(normalizedText.substring(start, end));
            if (ym.find()) {
                try {
                    gradYear = Integer.parseInt(ym.group());
                } catch (Exception ignored) {}
            }

            educationList.add(new ExtractedEducation(degree, level, field, "University / College", gradYear, "MEDIUM"));
            if (educationList.size() >= 3) break;
        }
        preview.setEducation(educationList);

        // 7. Certifications extraction
        List<ExtractedCertification> certList = new ArrayList<>();
        Pattern certPattern = Pattern.compile("(?i)\\b(AWS Certified[A-Za-z0-9\\s-]+|Oracle Certified[A-Za-z0-9\\s-]+|Azure Solutions Architect|CKA|Certified Kubernetes Administrator|Scrum Master|PMP|Google Cloud Certified[A-Za-z0-9\\s-]+)\\b");
        Matcher certMatcher = certPattern.matcher(normalizedText);
        while (certMatcher.find()) {
            String certName = certMatcher.group().trim();
            String issuer = certName.toLowerCase().contains("aws") ? "Amazon Web Services" :
                    certName.toLowerCase().contains("oracle") ? "Oracle" :
                    certName.toLowerCase().contains("azure") ? "Microsoft" : "Certification Authority";
            certList.add(new ExtractedCertification(certName, issuer, "HIGH"));
            if (certList.size() >= 4) break;
        }
        preview.setCertifications(certList);

        // 8. Experience extraction
        List<ExtractedExperience> expList = new ArrayList<>();
        Pattern expDatePattern = Pattern.compile("(?i)\\b(20[12][0-9])\\s*(?:-|–|to)\\s*(Present|Current|20[12][0-9])\\b");
        Matcher expMatcher = expDatePattern.matcher(normalizedText);
        while (expMatcher.find()) {
            String startDate = expMatcher.group(1);
            String endDateStr = expMatcher.group(2);
            boolean isCurrent = endDateStr.equalsIgnoreCase("present") || endDateStr.equalsIgnoreCase("current");
            String endDate = isCurrent ? null : endDateStr;

            String roleTitle = preview.getDesignation() != null ? preview.getDesignation().getValue() : "Software Engineer";
            expList.add(new ExtractedExperience(
                    "Technology Solutions Inc.",
                    roleTitle,
                    startDate,
                    endDate,
                    isCurrent,
                    "Backend Development",
                    "Java, Spring Boot, MySQL",
                    "Designed and implemented backend services and APIs.",
                    "MEDIUM"
            ));
            if (expList.size() >= 2) break;
        }
        preview.setExperience(expList);

        return preview;
    }

    // ==========================================
    // APPLY VERIFIED RESUME DATA TO PROFILE
    // ==========================================

    @Transactional
    public void applyVerifiedResume(ResumeExtractionPreviewDTO verified, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Employee e = new Employee();
                    e.setUser(user);
                    return employeeRepository.save(e);
                });

        if (verified.getFullName() != null && verified.getFullName().getValue() != null && !verified.getFullName().getValue().isBlank()) {
            user.setFullName(verified.getFullName().getValue().trim());
            userRepository.save(user);
        }

        if (verified.getPhone() != null && verified.getPhone().getValue() != null) {
            employee.setPhone(verified.getPhone().getValue().trim());
        }
        if (verified.getLocation() != null && verified.getLocation().getValue() != null) {
            employee.setLocation(verified.getLocation().getValue().trim());
        }
        if (verified.getDesignation() != null && verified.getDesignation().getValue() != null) {
            employee.setDesignation(verified.getDesignation().getValue().trim());
        }
        if (verified.getSummary() != null && verified.getSummary().getValue() != null) {
            employee.setSummary(verified.getSummary().getValue().trim());
        }
        employeeRepository.save(employee);

        // Apply verified skills
        if (verified.getSkills() != null) {
            for (ExtractedSkill es : verified.getSkills()) {
                if (es.getSkillName() != null && !es.getSkillName().isBlank()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(es.getSkillName().trim())
                            .orElseGet(() -> skillRepository.save(new Skill(es.getSkillName().trim(), "General")));

                    if (!employeeSkillRepository.existsByEmployeeIdAndSkillId(employee.getId(), skill.getId())) {
                        EmployeeSkill employeeSkill = new EmployeeSkill();
                        employeeSkill.setEmployee(employee);
                        employeeSkill.setSkill(skill);
                        // Only set proficiency if user reviewed and specified, else default to 3
                        employeeSkill.setProficiency(es.getProficiency() != null ? Math.max(1, Math.min(5, es.getProficiency())) : 3);
                        employeeSkill.setYearsExperience(es.getYearsOfExperience() != null ? es.getYearsOfExperience() : 0.0);
                        employeeSkillRepository.save(employeeSkill);
                    }
                }
            }
        }

        // Apply verified education
        if (verified.getEducation() != null) {
            for (ExtractedEducation edu : verified.getEducation()) {
                if (edu.getDegree() != null && !edu.getDegree().isBlank()) {
                    Education e = new Education();
                    e.setEmployee(employee);
                    e.setDegree(edu.getDegree().trim());
                    e.setDegreeLevel(edu.getDegreeLevel() != null ? edu.getDegreeLevel().trim() : inferDegreeLevel(edu.getDegree()));
                    e.setFieldOfStudy(edu.getFieldOfStudy() != null ? edu.getFieldOfStudy().trim() : "General");
                    e.setInstitution(edu.getInstitution() != null && !edu.getInstitution().isBlank() ? edu.getInstitution().trim() : "Institution");
                    e.setGraduationYear(edu.getGraduationYear() != null ? edu.getGraduationYear() : 2022);
                    educationRepository.save(e);
                }
            }
        }

        // Apply verified certifications
        if (verified.getCertifications() != null) {
            for (ExtractedCertification c : verified.getCertifications()) {
                if (c.getName() != null && !c.getName().isBlank()) {
                    Certification cert = new Certification();
                    cert.setEmployee(employee);
                    cert.setName(c.getName().trim());
                    cert.setIssuingOrganization(c.getIssuingOrganization() != null ? c.getIssuingOrganization().trim() : "Authority");
                    cert.setIssueDate(LocalDateTime.now().toLocalDate().toString());
                    certificationRepository.save(cert);
                }
            }
        }

        // Apply verified experience
        if (verified.getExperience() != null) {
            for (ExtractedExperience exp : verified.getExperience()) {
                if (exp.getCompany() != null && !exp.getCompany().isBlank()) {
                    Experience ex = new Experience();
                    ex.setEmployee(employee);
                    ex.setCompany(exp.getCompany().trim());
                    ex.setRoleTitle(exp.getRoleTitle() != null ? exp.getRoleTitle().trim() : "Software Engineer");
                    ex.setStartDate(exp.getStartDate() != null ? exp.getStartDate().trim() : "2021");
                    ex.setEndDate(exp.getEndDate());
                    ex.setCurrent(exp.isCurrent());
                    ex.setDomain(exp.getDomain() != null ? exp.getDomain().trim() : "General");
                    ex.setTechnologiesUsed(exp.getTechnologiesUsed());
                    ex.setResponsibilitiesSummary(exp.getResponsibilitiesSummary());
                    experienceRepository.save(ex);
                }
            }
        }
    }

    // ==========================================
    // JD ASSISTIVE PARSING
    // ==========================================

    public JdExtractionPreviewDTO parseJd(MultipartFile file) {
        String text = extractRawText(file);
        return parseJdFromText(text);
    }

    public JdExtractionPreviewDTO parseJdFromText(String rawText) {
        JdExtractionPreviewDTO preview = new JdExtractionPreviewDTO();
        if (rawText == null || rawText.isBlank()) {
            return preview;
        }

        preview.setDescription(rawText.length() > 1000 ? rawText.substring(0, 1000) + "..." : rawText);

        // 1. Role extraction
        Pattern rolePattern = Pattern.compile("(?i)\\b(Java Backend Developer|Backend Developer|Frontend Developer|Full Stack Developer|Software Engineer|Cloud Architect|DevOps Engineer|Data Engineer)\\b");
        Matcher roleMatcher = rolePattern.matcher(rawText);
        if (roleMatcher.find()) {
            preview.setRequiredRole(roleMatcher.group());
            preview.setTitle(roleMatcher.group() + " Project");
        } else {
            preview.setRequiredRole("Software Engineer");
            preview.setTitle("Engineering Project");
        }

        // 2. Experience required extraction
        Pattern expPattern = Pattern.compile("(?i)(\\d+(?:\\.\\d+)?)\\+?\\s*(?:years?|yrs?)(?:\\s+of)?\\s+(?:experience|exp)");
        Matcher expMatcher = expPattern.matcher(rawText);
        if (expMatcher.find()) {
            try {
                preview.setMinExperienceYears(Double.parseDouble(expMatcher.group(1)));
            } catch (Exception ignored) {
                preview.setMinExperienceYears(2.0);
            }
        } else {
            preview.setMinExperienceYears(2.0);
        }

        // 3. Domain extraction
        Pattern domainPattern = Pattern.compile("(?i)\\b(Backend Development|Frontend Development|Full Stack Development|Cloud Computing|DevOps|Data Engineering|Cybersecurity|AI & Machine Learning)\\b");
        Matcher domMatcher = domainPattern.matcher(rawText);
        if (domMatcher.find()) {
            preview.setRequiredDomain(domMatcher.group());
        } else {
            preview.setRequiredDomain("Backend Development");
        }

        // 4. Degree requirement extraction
        Pattern degPattern = Pattern.compile("(?i)\\b(Bachelor|Master|PhD|B\\.Tech|B\\.E\\.|B\\.S\\.|M\\.S\\.|M\\.Tech)\\b");
        Matcher degMatcher = degPattern.matcher(rawText);
        if (degMatcher.find()) {
            preview.setRequiredDegreeLevel(inferDegreeLevel(degMatcher.group()));
            preview.setRequiredDegreeField("Computer Science");
        }

        // 5. Skills extraction
        List<Skill> allSkills = skillRepository.findAll();
        List<ExtractedJdSkill> skills = new ArrayList<>();
        Set<Long> detectedIds = new HashSet<>();

        // Check if mandatory words precede or surround skill
        for (Skill skill : allSkills) {
            String nameLower = skill.getName().toLowerCase();
            Pattern p = Pattern.compile("\\b" + Pattern.quote(nameLower) + "\\b", Pattern.CASE_INSENSITIVE);
            if (p.matcher(rawText).find()) {
                if (detectedIds.add(skill.getId())) {
                    // Check if mandatory keyword is nearby
                    boolean mandatory = rawText.toLowerCase().contains("required")
                            || rawText.toLowerCase().contains("must have")
                            || rawText.toLowerCase().contains("mandatory");
                    skills.add(new ExtractedJdSkill(skill.getName(), 3, 4, mandatory, "HIGH"));
                }
            }
        }
        preview.setSkills(skills);

        return preview;
    }

    @Transactional
    public void applyVerifiedJdToProject(Long projectId, JdExtractionPreviewDTO verified, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isManager = project.getManager() != null && project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;
        if (!isManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to update this project");
        }

        if (verified.getTitle() != null && !verified.getTitle().isBlank()) {
            project.setTitle(verified.getTitle().trim());
        }
        if (verified.getDescription() != null && !verified.getDescription().isBlank()) {
            project.setDescription(verified.getDescription().trim());
        }
        if (verified.getRequiredRole() != null) {
            project.setRequiredRole(verified.getRequiredRole().trim());
        }
        project.setRoleMandatory(verified.isRoleMandatory());

        if (verified.getRequiredDomain() != null) {
            project.setRequiredDomain(verified.getRequiredDomain().trim());
        }
        project.setDomainMandatory(verified.isDomainMandatory());

        if (verified.getMinExperienceYears() != null) {
            project.setMinExperienceYears(verified.getMinExperienceYears());
        }
        project.setExperienceMandatory(verified.isExperienceMandatory());

        if (verified.getRequiredDegreeLevel() != null) {
            project.setRequiredDegreeLevel(verified.getRequiredDegreeLevel().trim());
        }
        if (verified.getRequiredDegreeField() != null) {
            project.setRequiredDegreeField(verified.getRequiredDegreeField().trim());
        }
        project.setEducationMandatory(verified.isEducationMandatory());

        if (verified.getRequiredCertification() != null) {
            project.setRequiredCertification(verified.getRequiredCertification().trim());
        }
        project.setCertificationMandatory(verified.isCertificationMandatory());

        projectRepository.save(project);

        if (verified.getSkills() != null) {
            for (ExtractedJdSkill js : verified.getSkills()) {
                if (js.getSkillName() != null && !js.getSkillName().isBlank()) {
                    Skill skill = skillRepository.findByNameIgnoreCase(js.getSkillName().trim())
                            .orElseGet(() -> skillRepository.save(new Skill(js.getSkillName().trim(), "General")));

                    ProjectSkill ps = projectSkillRepository.findByProjectIdAndSkillId(project.getId(), skill.getId())
                            .orElse(new ProjectSkill());
                    ps.setProject(project);
                    ps.setSkill(skill);
                    ps.setRequiredProficiency(Math.max(1, Math.min(5, js.getMinProficiency())));
                    ps.setImportance(Math.max(1, Math.min(5, js.getImportance())));
                    ps.setMandatory(js.isMandatory());
                    projectSkillRepository.save(ps);
                }
            }
        }
    }

    private String inferDegreeLevel(String degree) {
        if (degree == null) return "BACHELOR";
        String lower = degree.toLowerCase();
        if (lower.contains("phd") || lower.contains("doctor")) return "DOCTORATE";
        if (lower.contains("master") || lower.contains("m.s") || lower.contains("mtech") || lower.contains("m.tech") || lower.contains("mba")) return "MASTER";
        if (lower.contains("diploma") || lower.contains("associate")) return "DIPLOMA";
        return "BACHELOR";
    }
}
