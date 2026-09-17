package com.employeematching.service;

import com.employeematching.dto.response.JobDescriptionResponse;
import com.employeematching.entity.JobDescription;
import com.employeematching.entity.Project;
import com.employeematching.entity.User;
import com.employeematching.repository.JobDescriptionRepository;
import com.employeematching.repository.ProjectRepository;
import com.employeematching.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class JobDescriptionService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "docx", "doc", "txt");

    private final JobDescriptionRepository jobDescriptionRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/job-descriptions").toAbsolutePath().normalize();

    public JobDescriptionService(
            JobDescriptionRepository jobDescriptionRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository) {

        this.jobDescriptionRepository = jobDescriptionRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public JobDescriptionResponse uploadJobDescription(
            Long projectId,
            MultipartFile file,
            Authentication authentication) throws IOException {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        // Make sure the authenticated manager owns this project
        if (!project.getManager().getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to modify this project");
        }

        validateFile(file);

        if (jobDescriptionRepository.existsByProjectId(projectId)) {
            throw new RuntimeException(
                    "Job description already exists for this project");
        }

        Files.createDirectories(uploadDirectory);

        String originalFileName = file.getOriginalFilename();
        String safeOriginalName = Paths.get(originalFileName).getFileName().toString();

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

        JobDescription jobDescription = new JobDescription();

        jobDescription.setProject(project);
        jobDescription.setFileName(safeOriginalName);
        jobDescription.setFilePath(targetPath.toString());
        jobDescription.setProcessingStatus("PENDING");
        jobDescription.setUploadedAt(
                java.time.LocalDateTime.now().toString()
        );

        JobDescription saved =
                jobDescriptionRepository.save(jobDescription);

        return mapToResponse(saved);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Job description file is required");
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

    public JobDescriptionResponse getJobDescription(
            Long projectId,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        if (!project.getManager().getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You are not authorized to access this project");
        }

        JobDescription jobDescription =
                jobDescriptionRepository.findByProjectId(projectId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job description not found"));

        return mapToResponse(jobDescription);
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));
    }

    private JobDescriptionResponse mapToResponse(
            JobDescription jobDescription) {

        return new JobDescriptionResponse(
                jobDescription.getId(),
                jobDescription.getProject().getId(),
                jobDescription.getFileName(),
                jobDescription.getProcessingStatus(),
                jobDescription.getUploadedAt()
        );
    }
}