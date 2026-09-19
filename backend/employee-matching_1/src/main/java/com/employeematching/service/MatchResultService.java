package com.employeematching.service;

import com.employeematching.dto.request.MatchCalculationRequest;
import com.employeematching.dto.response.MatchExplanationResponse;
import com.employeematching.dto.response.MatchResultResponse;
import com.employeematching.entity.*;
import com.employeematching.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchResultService {

    private final MatchResultRepository matchResultRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final CertificationRepository certificationRepository;
    private final EducationRepository educationRepository;
    private final ExperienceRepository experienceRepository;
    private final SkillAliasRepository skillAliasRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public MatchResultService(
            MatchResultRepository matchResultRepository,
            EmployeeRepository employeeRepository,
            ProjectRepository projectRepository,
            EmployeeSkillRepository employeeSkillRepository,
            ProjectSkillRepository projectSkillRepository,
            CertificationRepository certificationRepository,
            EducationRepository educationRepository,
            ExperienceRepository experienceRepository,
            SkillAliasRepository skillAliasRepository,
            UserRepository userRepository) {

        this.matchResultRepository = matchResultRepository;
        this.employeeRepository = employeeRepository;
        this.projectRepository = projectRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.certificationRepository = certificationRepository;
        this.educationRepository = educationRepository;
        this.experienceRepository = experienceRepository;
        this.skillAliasRepository = skillAliasRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MatchResultResponse calculateAndSaveMatch(
            MatchCalculationRequest request,
            Authentication authentication) {

        User authenticatedUser = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isOwnerEmployee = employee.getUser().getId().equals(authenticatedUser.getId());
        boolean isProjectManager = project.getManager() != null && project.getManager().getUser().getId().equals(authenticatedUser.getId());
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to calculate match for this employee and project");
        }

        return performMatchCalculation(employee, project);
    }

    @Transactional
    public List<MatchResultResponse> calculateAllMatchesForProject(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isProjectManager = project.getManager() != null && project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to calculate matches for this project");
        }

        List<Employee> allEmployees = employeeRepository.findAll();

        return allEmployees.stream()
                .map(employee -> performMatchCalculation(employee, project))
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getMyMatchResults(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        return matchResultRepository.findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getRecommendedProjectsForEmployee(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Employee profile not found"));

        List<Project> openProjects = projectRepository.findByStatus("OPEN");

        return openProjects.stream()
                .map(project -> performMatchCalculation(employee, project))
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public List<MatchResultResponse> getProjectMatchResults(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isProjectManager = project.getManager() != null && project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view match results for this project");
        }

        return matchResultRepository.findByProjectId(projectId)
                .stream()
                .map(this::mapToResponse)
                .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                .toList();
    }

    public MatchResultResponse getMatchResultById(
            Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isOwnerEmployee = matchResult.getEmployee().getUser().getId().equals(user.getId());
        boolean isProjectManager = matchResult.getProject().getManager() != null
                && matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view this match result");
        }

        return mapToResponse(matchResult);
    }

    public MatchExplanationResponse getMatchExplanation(
            Long id,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isOwnerEmployee = matchResult.getEmployee().getUser().getId().equals(user.getId());
        boolean isProjectManager = matchResult.getProject().getManager() != null
                && matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isOwnerEmployee && !isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view explanation for this match result");
        }

        return buildExplanationResponse(matchResult);
    }

    public MatchExplanationResponse getCandidateExplanation(
            Long projectId,
            Long employeeId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isProjectManager = project.getManager() != null && project.getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to view candidate explanation");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        MatchResult matchResult = matchResultRepository.findByEmployeeIdAndProjectId(employeeId, projectId)
                .orElseGet(() -> {
                    performMatchCalculation(employee, project);
                    return matchResultRepository.findByEmployeeIdAndProjectId(employeeId, projectId)
                            .orElseThrow(() -> new RuntimeException("Match calculation failed"));
                });

        return buildExplanationResponse(matchResult);
    }

    public void deleteMatchResult(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        MatchResult matchResult = matchResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match result not found"));

        boolean isProjectManager = matchResult.getProject().getManager() != null
                && matchResult.getProject().getManager().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == User.Role.ADMIN;

        if (!isProjectManager && !isAdmin) {
            throw new RuntimeException("You are not authorized to delete this match result");
        }

        matchResultRepository.delete(matchResult);
    }

    // ==========================================
    // CORE DETERMINISTIC 6-DIMENSION ENGINE
    // ==========================================

    @Transactional
    public MatchResultResponse performMatchCalculation(Employee employee, Project project) {
        List<String> failedMandatoryReasons = new ArrayList<>();
        List<String> strengths = new ArrayList<>();
        List<String> missingOrGaps = new ArrayList<>();

        // 1. SKILLS DIMENSION (Max 35.0 Points)
        List<ProjectSkill> projectSkills = projectSkillRepository.findByProjectId(project.getId());
        List<EmployeeSkill> employeeSkills = employeeSkillRepository.findByEmployeeId(employee.getId());

        List<String> matchedSkillsList = new ArrayList<>();
        List<String> missingSkillsList = new ArrayList<>();
        List<Map<String, Object>> skillDetails = new ArrayList<>();

        double skillsScore;
        double skillsPoints;

        if (projectSkills.isEmpty()) {
            skillsScore = 1.0;
            skillsPoints = 35.0;
        } else {
            // Build fast employee skill resolver with aliases
            Map<String, EmployeeSkill> empSkillByName = new HashMap<>();
            for (EmployeeSkill es : employeeSkills) {
                if (es.getSkill() != null && es.getSkill().getName() != null) {
                    empSkillByName.put(es.getSkill().getName().trim().toLowerCase(), es);
                }
            }

            double totalWeightedRatio = 0.0;
            double totalImportance = 0.0;

            for (ProjectSkill ps : projectSkills) {
                if (ps.getSkill() == null || ps.getSkill().getName() == null) continue;

                String skillName = ps.getSkill().getName().trim();
                int importance = Math.max(1, Math.min(5, ps.getImportance()));
                double reqProf = Math.max(1.0, (double) ps.getRequiredProficiency());
                boolean isMandatory = ps.isMandatory();

                totalImportance += importance;

                // Check direct match
                EmployeeSkill matchedEs = empSkillByName.get(skillName.toLowerCase());

                // Check aliases if not found directly
                if (matchedEs == null) {
                    List<SkillAlias> aliases = skillAliasRepository.findBySkillId(ps.getSkill().getId());
                    for (SkillAlias alias : aliases) {
                        if (empSkillByName.containsKey(alias.getAlias().trim().toLowerCase())) {
                            matchedEs = empSkillByName.get(alias.getAlias().trim().toLowerCase());
                            break;
                        }
                    }
                }

                Map<String, Object> detail = new HashMap<>();
                detail.put("skillName", skillName);
                detail.put("requiredProficiency", reqProf);
                detail.put("importance", importance);
                detail.put("isMandatory", isMandatory);

                if (matchedEs != null) {
                    double empProf = matchedEs.getProficiency();
                    double ratio = Math.min(1.0, empProf / reqProf);
                    totalWeightedRatio += ratio * importance;

                    matchedSkillsList.add(skillName + " (Prof: " + (int) empProf + "/" + (int) reqProf + ")");
                    detail.put("employeeProficiency", empProf);
                    detail.put("matched", true);
                    detail.put("pointsEarned", Math.round(ratio * importance * 100.0) / 100.0);

                    if (isMandatory && ratio < 0.5) {
                        failedMandatoryReasons.add("[MANDATORY FAILED] Skill proficiency below required threshold: "
                                + skillName + " (" + (int) empProf + "/" + (int) reqProf + ")");
                    }
                } else {
                    missingSkillsList.add(skillName);
                    detail.put("employeeProficiency", 0);
                    detail.put("matched", false);
                    detail.put("pointsEarned", 0.0);

                    if (isMandatory) {
                        failedMandatoryReasons.add("[MANDATORY FAILED] Missing required skill: " + skillName);
                    }
                }
                skillDetails.add(detail);
            }

            skillsScore = totalImportance > 0 ? (totalWeightedRatio / totalImportance) : 1.0;
            skillsPoints = Math.round(skillsScore * 35.0 * 100.0) / 100.0;
        }

        if (skillsScore >= 0.8) {
            strengths.add("Strong technical skills coverage (" + (int) Math.round(skillsScore * 100) + "%)");
        } else if (skillsScore < 0.5) {
            missingOrGaps.add("Significant technical skills gap (" + (int) Math.round(skillsScore * 100) + "% match)");
        }

        // 2. EXPERIENCE DIMENSION (Max 20.0 Points)
        double empExpYears = employee.getTotalExperienceYears() > 0 ? employee.getTotalExperienceYears() : employee.getExperience();
        double reqExpYears = project.getMinExperienceYears() > 0 ? project.getMinExperienceYears() : project.getExperienceRequired();
        boolean isExpMandatory = project.isExperienceMandatory();

        double baseExpRatio = reqExpYears <= 0.0 ? 1.0 : Math.min(1.0, empExpYears / reqExpYears);
        double baseExpPoints = baseExpRatio * 14.0;

        // Relevant domain / role experience bonus (up to 6.0 points)
        List<Experience> pastExperiences = experienceRepository.findByEmployeeId(employee.getId());
        double bonusPoints = 2.0; // Baseline

        String reqDomain = project.getRequiredDomain();
        String reqRole = project.getRequiredRole();

        boolean hasDirectPastExperience = false;
        for (Experience exp : pastExperiences) {
            boolean domainMatch = reqDomain != null && exp.getDomain() != null && exp.getDomain().toLowerCase().contains(reqDomain.toLowerCase());
            boolean roleMatch = reqRole != null && exp.getRoleTitle() != null && exp.getRoleTitle().toLowerCase().contains(reqRole.toLowerCase());
            if (domainMatch || roleMatch) {
                hasDirectPastExperience = true;
                break;
            }
        }

        if (hasDirectPastExperience) {
            bonusPoints = 6.0;
        } else if (employee.getPrimaryDomain() != null && reqDomain != null && employee.getPrimaryDomain().equalsIgnoreCase(reqDomain)) {
            bonusPoints = 4.0;
        }

        double experiencePoints = Math.min(20.0, Math.round((baseExpPoints + bonusPoints) * 100.0) / 100.0);
        double experienceScore = Math.round((experiencePoints / 20.0) * 100.0) / 100.0;

        if (isExpMandatory && empExpYears < reqExpYears) {
            failedMandatoryReasons.add("[MANDATORY FAILED] Insufficient experience: " + empExpYears + " yrs (Requires min " + reqExpYears + " yrs)");
        }

        if (empExpYears >= reqExpYears && reqExpYears > 0) {
            strengths.add("Exceeds or meets experience requirement (" + empExpYears + "/" + reqExpYears + " years)");
        } else if (empExpYears < reqExpYears) {
            missingOrGaps.add("Experience below project requirement (" + empExpYears + " vs " + reqExpYears + " years)");
        }

        // 3. ROLE ALIGNMENT DIMENSION (Max 15.0 Points)
        double roleScore;
        double rolePoints;
        boolean isRoleMandatory = project.isRoleMandatory();

        if (reqRole == null || reqRole.isBlank()) {
            roleScore = 1.0;
            rolePoints = 15.0;
        } else {
            String empDesignation = employee.getDesignation() != null ? employee.getDesignation().trim().toLowerCase() : "";
            String targetRoleLower = reqRole.trim().toLowerCase();

            if (!empDesignation.isEmpty() && (empDesignation.contains(targetRoleLower) || targetRoleLower.contains(empDesignation))) {
                roleScore = 1.0;
                rolePoints = 15.0;
            } else if (hasMatchingPastRole(pastExperiences, targetRoleLower)) {
                roleScore = 0.85;
                rolePoints = 12.75;
            } else if (hasPartialRoleMatch(empDesignation, targetRoleLower)) {
                roleScore = 0.60;
                rolePoints = 9.0;
            } else {
                roleScore = 0.20;
                rolePoints = 3.0;
            }

            if (isRoleMandatory && roleScore < 0.50) {
                failedMandatoryReasons.add("[MANDATORY FAILED] Role mismatch: Candidate designation '" + employee.getDesignation()
                        + "' does not satisfy mandatory role '" + reqRole + "'");
            }
        }

        if (roleScore >= 0.85 && reqRole != null && !reqRole.isBlank()) {
            strengths.add("Strong role alignment for " + reqRole);
        } else if (roleScore < 0.50 && reqRole != null && !reqRole.isBlank()) {
            missingOrGaps.add("Role misalignment: " + (employee.getDesignation() != null ? employee.getDesignation() : "Not specified") + " vs " + reqRole);
        }

        // 4. EDUCATION ALIGNMENT DIMENSION (Max 12.0 Points)
        String reqDegree = project.getRequiredDegreeLevel();
        String reqField = project.getRequiredDegreeField();
        boolean isEduMandatory = project.isEducationMandatory();

        List<Education> educations = educationRepository.findByEmployeeId(employee.getId());
        int empHighestRank = getHighestDegreeRank(educations);
        int reqRank = getDegreeRank(reqDegree);

        double degreeLevelPoints;
        if (reqDegree == null || reqDegree.isBlank()) {
            degreeLevelPoints = 8.0;
        } else if (empHighestRank >= reqRank) {
            degreeLevelPoints = 8.0;
        } else if (empHighestRank == reqRank - 1) {
            degreeLevelPoints = 5.0;
        } else {
            degreeLevelPoints = 2.0;
        }

        double fieldPoints;
        if (reqField == null || reqField.isBlank()) {
            fieldPoints = 4.0;
        } else {
            boolean fieldMatch = false;
            for (Education edu : educations) {
                if (edu.getFieldOfStudy() != null && edu.getFieldOfStudy().toLowerCase().contains(reqField.toLowerCase())) {
                    fieldMatch = true;
                    break;
                }
            }
            fieldPoints = fieldMatch ? 4.0 : 2.0;
        }

        double educationPoints = Math.min(12.0, Math.round((degreeLevelPoints + fieldPoints) * 100.0) / 100.0);
        double educationScore = Math.round((educationPoints / 12.0) * 100.0) / 100.0;

        if (isEduMandatory && empHighestRank < reqRank) {
            failedMandatoryReasons.add("[MANDATORY FAILED] Education level insufficient: Candidate highest degree is below " + reqDegree);
        }

        if (educationScore >= 0.8) {
            strengths.add("Satisfies academic qualifications (" + (reqDegree != null ? reqDegree : "Degree") + ")");
        }

        // 5. CERTIFICATION ALIGNMENT DIMENSION (Max 10.0 Points)
        String reqCert = project.getRequiredCertification();
        boolean isCertMandatory = project.isCertificationMandatory();
        List<Certification> certs = certificationRepository.findByEmployeeId(employee.getId());

        String today = LocalDate.now().toString();
        List<Certification> activeCerts = certs.stream()
                .filter(c -> c.getExpiryDate() == null || c.getExpiryDate().isBlank() || c.getExpiryDate().compareTo(today) >= 0)
                .toList();

        double certPoints;
        double certificationScore;

        if (reqCert != null && !reqCert.isBlank()) {
            boolean certMatch = activeCerts.stream()
                    .anyMatch(c -> c.getName() != null && c.getName().toLowerCase().contains(reqCert.toLowerCase()));

            if (certMatch) {
                certPoints = 10.0;
                certificationScore = 1.0;
                strengths.add("Holds mandatory/required certification: " + reqCert);
            } else if (!activeCerts.isEmpty()) {
                certPoints = 4.0;
                certificationScore = 0.40;
                missingOrGaps.add("Missing specific certification: " + reqCert + " (has " + activeCerts.size() + " other certs)");
            } else {
                certPoints = 0.0;
                certificationScore = 0.0;
                missingOrGaps.add("Missing required certification: " + reqCert);
            }

            if (isCertMandatory && !certMatch) {
                failedMandatoryReasons.add("[MANDATORY FAILED] Missing required certification: " + reqCert);
            }
        } else {
            if (activeCerts.size() >= 2) {
                certPoints = 10.0;
                certificationScore = 1.0;
                strengths.add("Holds multiple active professional certifications (" + activeCerts.size() + ")");
            } else if (activeCerts.size() == 1) {
                certPoints = 7.0;
                certificationScore = 0.70;
            } else {
                certPoints = 3.0;
                certificationScore = 0.30;
            }
        }

        // 6. DOMAIN ALIGNMENT DIMENSION (Max 8.0 Points)
        boolean isDomainMandatory = project.isDomainMandatory();
        double domainScore;
        double domainPoints;

        if (reqDomain == null || reqDomain.isBlank()) {
            domainScore = 1.0;
            domainPoints = 8.0;
        } else {
            String empDomain = employee.getPrimaryDomain() != null ? employee.getPrimaryDomain().trim().toLowerCase() : "";
            String reqDomainLower = reqDomain.trim().toLowerCase();

            if (!empDomain.isEmpty() && empDomain.equalsIgnoreCase(reqDomainLower)) {
                domainScore = 1.0;
                domainPoints = 8.0;
            } else if (hasMatchingPastDomain(pastExperiences, reqDomainLower)) {
                domainScore = 0.75;
                domainPoints = 6.0;
            } else if (!empDomain.isEmpty() && (empDomain.contains(reqDomainLower) || reqDomainLower.contains(empDomain))) {
                domainScore = 0.50;
                domainPoints = 4.0;
            } else {
                domainScore = 0.19;
                domainPoints = 1.5;
            }

            if (isDomainMandatory && domainPoints < 4.0) {
                failedMandatoryReasons.add("[MANDATORY FAILED] Domain mismatch: Candidate primary domain '"
                        + employee.getPrimaryDomain() + "' does not match mandatory domain '" + reqDomain + "'");
            }
        }

        if (domainScore >= 0.75 && reqDomain != null && !reqDomain.isBlank()) {
            strengths.add("Strong domain alignment in " + reqDomain);
        }

        // OVERALL SCORE CALCULATION & MANDATORY CAPPING
        boolean mandatoryPassed = failedMandatoryReasons.isEmpty();
        double rawScore = skillsPoints + experiencePoints + rolePoints + educationPoints + certPoints + domainPoints;
        double finalScore;

        if (!mandatoryPassed) {
            // Mandatory failure caps score at 40.0% maximum
            finalScore = Math.min(40.0, rawScore);
        } else {
            finalScore = Math.min(100.0, rawScore);
        }
        finalScore = Math.round(finalScore * 100.0) / 100.0;

        // Structured Breakdown JSON
        Map<String, Object> breakdown = new LinkedHashMap<>();
        breakdown.put("mandatoryPassed", mandatoryPassed);
        breakdown.put("failedMandatoryReasons", failedMandatoryReasons);
        breakdown.put("overallScore", finalScore);
        breakdown.put("rawScore", Math.round(rawScore * 100.0) / 100.0);

        Map<String, Object> catScores = new LinkedHashMap<>();
        catScores.put("skills", Map.of("earned", skillsPoints, "max", 35.0, "score", skillsScore));
        catScores.put("experience", Map.of("earned", experiencePoints, "max", 20.0, "score", experienceScore));
        catScores.put("role", Map.of("earned", rolePoints, "max", 15.0, "score", roleScore));
        catScores.put("education", Map.of("earned", educationPoints, "max", 12.0, "score", educationScore));
        catScores.put("certifications", Map.of("earned", certPoints, "max", 10.0, "score", certificationScore));
        catScores.put("domain", Map.of("earned", domainPoints, "max", 8.0, "score", domainScore));
        breakdown.put("categoryScores", catScores);

        breakdown.put("strengths", strengths);
        breakdown.put("missingOrGaps", missingOrGaps);
        breakdown.put("skillDetails", skillDetails);

        String breakdownJson;
        try {
            breakdownJson = objectMapper.writeValueAsString(breakdown);
        } catch (Exception e) {
            breakdownJson = "{}";
        }

        // Upsert MatchResult entity
        MatchResult matchResult = matchResultRepository
                .findByEmployeeIdAndProjectId(employee.getId(), project.getId())
                .orElse(new MatchResult());

        matchResult.setEmployee(employee);
        matchResult.setProject(project);
        matchResult.setMatchScore(finalScore);
        matchResult.setMandatoryPassed(mandatoryPassed);

        matchResult.setSkillsScore(roundScore(skillsScore));
        matchResult.setExperienceScore(roundScore(experienceScore));
        matchResult.setRoleScore(roundScore(roleScore));
        matchResult.setEducationScore(roundScore(educationScore));
        matchResult.setCertificationScore(roundScore(certificationScore));
        matchResult.setDomainScore(roundScore(domainScore));

        matchResult.setMatchBreakdownJson(breakdownJson);
        matchResult.setGeneratedAt(LocalDateTime.now().toString());

        MatchResult saved = matchResultRepository.save(matchResult);

        return mapToResponse(saved);
    }

    private boolean hasMatchingPastRole(List<Experience> experiences, String targetRole) {
        for (Experience exp : experiences) {
            if (exp.getRoleTitle() != null && exp.getRoleTitle().toLowerCase().contains(targetRole)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasPartialRoleMatch(String empDesignation, String targetRole) {
        String[] keywords = {"developer", "engineer", "architect", "lead", "analyst", "manager", "designer", "tester", "consultant"};
        for (String kw : keywords) {
            if (empDesignation.contains(kw) && targetRole.contains(kw)) {
                return true;
            }
        }
        return false;
    }

    private boolean hasMatchingPastDomain(List<Experience> experiences, String targetDomain) {
        for (Experience exp : experiences) {
            if (exp.getDomain() != null && exp.getDomain().toLowerCase().contains(targetDomain)) {
                return true;
            }
        }
        return false;
    }

    private int getDegreeRank(String degree) {
        if (degree == null) return 2; // Default to Bachelor
        String d = degree.toUpperCase();
        if (d.contains("DOCTOR") || d.contains("PHD")) return 4;
        if (d.contains("MASTER") || d.contains("M.") || d.contains("MBA") || d.contains("MTECH")) return 3;
        if (d.contains("BACHELOR") || d.contains("B.") || d.contains("BTECH") || d.contains("BE")) return 2;
        if (d.contains("DIPLOMA") || d.contains("ASSOCIATE")) return 1;
        return 0;
    }

    private int getHighestDegreeRank(List<Education> educations) {
        if (educations == null || educations.isEmpty()) return 0;
        int max = 0;
        for (Education edu : educations) {
            int rank = getDegreeRank(edu.getDegreeLevel() != null ? edu.getDegreeLevel() : edu.getDegree());
            if (rank > max) {
                max = rank;
            }
        }
        return max;
    }

    private double roundScore(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private User getAuthenticatedUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    private MatchResultResponse mapToResponse(MatchResult matchResult) {
        Employee emp = matchResult.getEmployee();
        User user = emp.getUser();

        List<String> skills = employeeSkillRepository.findByEmployeeId(emp.getId())
                .stream()
                .filter(es -> es.getSkill() != null && es.getSkill().getName() != null)
                .map(es -> es.getSkill().getName())
                .toList();

        MatchResultResponse resp = new MatchResultResponse();
        resp.setId(matchResult.getId());
        resp.setEmployeeId(emp.getId());
        resp.setEmployeeName(user.getName());
        resp.setEmployeeEmail(user.getEmail());
        resp.setEmployeeDesignation(emp.getDesignation());
        resp.setEmployeeDepartment(emp.getDepartment());
        resp.setEmployeeExperience(emp.getTotalExperienceYears() > 0 ? emp.getTotalExperienceYears() : emp.getExperience());
        resp.setEmployeeSkills(skills);

        resp.setProjectId(matchResult.getProject().getId());
        resp.setProjectTitle(matchResult.getProject().getTitle());

        resp.setMatchScore(matchResult.getMatchScore());
        resp.setMandatoryPassed(matchResult.isMandatoryPassed());

        resp.setSkillsScore(matchResult.getSkillsScore());
        resp.setExperienceScore(matchResult.getExperienceScore());
        resp.setRoleScore(matchResult.getRoleScore());
        resp.setEducationScore(matchResult.getEducationScore());
        resp.setCertificationScore(matchResult.getCertificationScore());
        resp.setDomainScore(matchResult.getDomainScore());

        resp.setSkillsPoints(roundScore(matchResult.getSkillsScore() * 35.0));
        resp.setExperiencePoints(roundScore(matchResult.getExperienceScore() * 20.0));
        resp.setRolePoints(roundScore(matchResult.getRoleScore() * 15.0));
        resp.setEducationPoints(roundScore(matchResult.getEducationScore() * 12.0));
        resp.setCertificationPoints(roundScore(matchResult.getCertificationScore() * 10.0));
        resp.setDomainPoints(roundScore(matchResult.getDomainScore() * 8.0));

        resp.setMatchBreakdownJson(matchResult.getMatchBreakdownJson());
        resp.setGeneratedAt(matchResult.getGeneratedAt());

        return resp;
    }

    @SuppressWarnings("unchecked")
    private MatchExplanationResponse buildExplanationResponse(MatchResult matchResult) {
        Employee emp = matchResult.getEmployee();
        User user = emp.getUser();
        Project project = matchResult.getProject();

        MatchExplanationResponse resp = new MatchExplanationResponse();
        resp.setMatchResultId(matchResult.getId());
        resp.setEmployeeId(emp.getId());
        resp.setEmployeeName(user.getName());
        resp.setEmployeeEmail(user.getEmail());
        resp.setEmployeeDesignation(emp.getDesignation());
        resp.setEmployeeDepartment(emp.getDepartment());
        resp.setProjectId(project.getId());
        resp.setProjectTitle(project.getTitle());
        resp.setOverallMatchScore(matchResult.getMatchScore());
        resp.setMandatoryPassed(matchResult.isMandatoryPassed());

        resp.setSkillsScore(matchResult.getSkillsScore());
        resp.setExperienceScore(matchResult.getExperienceScore());
        resp.setRoleScore(matchResult.getRoleScore());
        resp.setEducationScore(matchResult.getEducationScore());
        resp.setCertificationScore(matchResult.getCertificationScore());
        resp.setDomainScore(matchResult.getDomainScore());

        resp.setSkillsPoints(roundScore(matchResult.getSkillsScore() * 35.0));
        resp.setExperiencePoints(roundScore(matchResult.getExperienceScore() * 20.0));
        resp.setRolePoints(roundScore(matchResult.getRoleScore() * 15.0));
        resp.setEducationPoints(roundScore(matchResult.getEducationScore() * 12.0));
        resp.setCertificationPoints(roundScore(matchResult.getCertificationScore() * 10.0));
        resp.setDomainPoints(roundScore(matchResult.getDomainScore() * 8.0));

        resp.setMatchBreakdownJson(matchResult.getMatchBreakdownJson());
        resp.setGeneratedAt(matchResult.getGeneratedAt());

        // Parse breakdown json to populate strengths, gaps, and mandatory reasons
        if (matchResult.getMatchBreakdownJson() != null && !matchResult.getMatchBreakdownJson().isBlank()) {
            try {
                Map<String, Object> map = objectMapper.readValue(matchResult.getMatchBreakdownJson(), Map.class);
                if (map.containsKey("failedMandatoryReasons")) {
                    resp.setFailedMandatoryReasons((List<String>) map.get("failedMandatoryReasons"));
                }
                if (map.containsKey("strengths")) {
                    resp.setStrengths((List<String>) map.get("strengths"));
                }
                if (map.containsKey("missingOrGaps")) {
                    resp.setMissingOrGaps((List<String>) map.get("missingOrGaps"));
                }
                if (map.containsKey("skillDetails")) {
                    List<Map<String, Object>> skillDetails = (List<Map<String, Object>>) map.get("skillDetails");
                    List<String> matched = new ArrayList<>();
                    List<String> missing = new ArrayList<>();
                    for (Map<String, Object> sd : skillDetails) {
                        String name = (String) sd.get("skillName");
                        Boolean isMatched = (Boolean) sd.get("matched");
                        if (Boolean.TRUE.equals(isMatched)) {
                            matched.add(name);
                        } else {
                            missing.add(name);
                        }
                    }
                    resp.setMatchedSkills(matched);
                    resp.setMissingSkills(missing);
                }
            } catch (Exception ignored) {
            }
        }

        return resp;
    }
}
