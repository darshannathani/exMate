package com.exMate.backend.controller.Candidate;

import com.exMate.backend.DTO.CandidateResultDTO;
import com.exMate.backend.DTO.SectionScoreDTO;
import com.exMate.backend.enums.SectionType;
import com.exMate.backend.service.Candidate.CandidateResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/candidate/results")
@RequiredArgsConstructor
public class CandidateResultController {
    private final CandidateResultService candidateResultService;

    @GetMapping("/{candidateId}")
    public ResponseEntity<List<CandidateResultDTO>> getAllResults(@PathVariable int candidateId) {
        return ResponseEntity.ok(candidateResultService.getAllResultsForCandidate(candidateId));
    }

    @GetMapping("/{candidateId}/exam/{examId}")
    public ResponseEntity<CandidateResultDTO> getDetailedExamResult(
            @PathVariable int candidateId,
            @PathVariable int examId) {
        return ResponseEntity.ok(candidateResultService.getDetailedExamResult(candidateId, examId));
    }

    @GetMapping("/{candidateId}/exam/{examId}/sections")
    public ResponseEntity<Map<SectionType, SectionScoreDTO>> getSectionWiseAnalysis(
            @PathVariable int candidateId,
            @PathVariable int examId) {
        return ResponseEntity.ok(candidateResultService.getSectionWiseAnalysis(candidateId, examId));
    }

    @GetMapping("/{candidateId}/completed")
    public ResponseEntity<List<CandidateResultDTO>> getCompletedExams(@PathVariable int candidateId) {
        return ResponseEntity.ok(candidateResultService.getCompletedExams(candidateId));
    }

    @GetMapping("/{candidateId}/pending")
    public ResponseEntity<List<CandidateResultDTO>> getPendingExams(@PathVariable int candidateId) {
        return ResponseEntity.ok(candidateResultService.getPendingExams(candidateId));
    }
}