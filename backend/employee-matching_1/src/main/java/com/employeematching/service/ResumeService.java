package com.employeematching.service;

import com.employeematching.dto.response.ResumeResponse;
import com.employeematching.entity.Employee;
import com.employeematching.entity.Resume;
import com.employeematching.entity.User;
import com.employeematching.repository.EmployeeRepository;
import com.employeematching.repository.ResumeRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class ResumeService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "doc", "txt");

    private final ResumeRepository resumeRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/resumes").toAbsolutePath().normalize();

    public ResumeService(
            ResumeRepository resumeRepository,
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    // =========================
    // EMPLOYEE: UPLOAD RESUME
    // =========================

    public ResumeResponse uploadResume(
            MultipartFile file,
            Authentication authentication) throws IOException {

        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee profile not found"));

        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        String safeOriginalName = Paths.get(originalFileName).getFileName().toString();

        Files.createDirectories(uploadDirectory);

        String storedFileName = UUID.randomUUID() + "_" + safeOriginalName;

        Path targetPath = uploadDirectory.resolve(storedFileName).normalize();

        if (!targetPath.startsWith(uploadDirectory)) {
            throw new RuntimeException("Invalid file path");
        }

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Resume resume = new Resume();

        resume.setEmployee(employee);
        resume.setFileName(safeOriginalName);
        resume.setFilePath(targetPath.toString());
        resume.setProcessingStatus("PENDING");
        resume.setUploadedAt(
                java.time.LocalDateTime.now().toString()
        );

        Resume savedResume =
                resumeRepository.save(resume);

        return mapToResponse(savedResume);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum allowed limit of 5MB");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new RuntimeException("Invalid file name");
        }

        String extension = getFileExtension(originalFileName).toLowerCase(Locale.ROOT);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new RuntimeException("File type not supported. Allowed formats: PDF, DOCX, DOC, TXT");
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            return "";
        }
        return filename.substring(lastDotIndex + 1);
    }

    // =========================
    // EMPLOYEE: MY RESUMES
    // =========================

    public List<ResumeResponse> getMyResumes(
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Employee employee = employeeRepository
                .findByUserId(user.getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee profile not found"));

        return resumeRepository
                .findByEmployeeId(employee.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // =========================
    // COMMON METHODS
    // =========================

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));
    }

    private ResumeResponse mapToResponse(
            Resume resume) {

        return new ResumeResponse(
                resume.getId(),
                resume.getEmployee().getId(),
                resume.getFileName(),
                resume.getProcessingStatus(),
                resume.getUploadedAt()
        );
    }
}