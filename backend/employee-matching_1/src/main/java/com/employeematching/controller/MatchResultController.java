package com.employeematching.controller;

import com.employeematching.dto.response.MatchExplanationResponse;
import com.employeematching.dto.request.MatchCalculationRequest;
import com.employeematching.dto.response.MatchResultResponse;
import com.employeematching.service.MatchResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/match-results")
public class MatchResultController {

    private final MatchResultService matchResultService;

    public MatchResultController(MatchResultService matchResultService) {
        this.matchResultService = matchResultService;
    }

    // ==========================================
    // CALCULATE MATCH RESULT FOR AN EMPLOYEE & PROJECT
    // ==========================================

    @PostMapping("/calculate")
    public ResponseEntity<MatchResultResponse> calculateMatch(
            @Valid @RequestBody MatchCalculationRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.calculateAndSaveMatch(request, authentication)
        );
    }

    // ==========================================
    // CALCULATE ALL CANDIDATE MATCHES FOR A PROJECT (MANAGER)
    // ==========================================

    @PostMapping("/project/{projectId}/calculate-all")
    public ResponseEntity<List<MatchResultResponse>> calculateAllForProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.calculateAllMatchesForProject(projectId, authentication)
        );
    }

    // ==========================================
    // GET MY MATCH RESULTS (EMPLOYEE)
    // ==========================================

    @GetMapping("/my-matches")
    public ResponseEntity<List<MatchResultResponse>> getMyMatchResults(
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.getMyMatchResults(authentication)
        );
    }

    // ==========================================
    // GET MATCH RESULTS FOR A PROJECT (MANAGER)
    // ==========================================

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MatchResultResponse>> getProjectMatchResults(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.getProjectMatchResults(projectId, authentication)
        );
    }

    @GetMapping("/project/{projectId}/recommended")
    public ResponseEntity<List<MatchResultResponse>> getRecommendedCandidatesForProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.calculateAllMatchesForProject(projectId, authentication)
        );
    }

    // ==========================================
    // GET MATCH RESULT BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<MatchResultResponse> getMatchResultById(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.getMatchResultById(id, authentication)
        );
    }

    // ==========================================
    // GET MATCH EXPLANATION BY ID
    // ==========================================

    @GetMapping("/{id}/explanation")
    public ResponseEntity<MatchExplanationResponse> getMatchExplanation(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                matchResultService.getMatchExplanation(id, authentication)
        );
    }

    // ==========================================
    // DELETE MATCH RESULT
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatchResult(
            @PathVariable Long id,
            Authentication authentication) {

        matchResultService.deleteMatchResult(id, authentication);
        return ResponseEntity.noContent().build();
    }
}