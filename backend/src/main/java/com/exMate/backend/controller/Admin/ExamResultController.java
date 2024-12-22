package com.exMate.backend.controller.Admin;

import com.exMate.backend.model.ExamResult;
import com.exMate.backend.service.Admin.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/results")
@RequiredArgsConstructor
public class ExamResultController {
    private final ExamResultService examResultService;

    @PostMapping("/compute/{candidateId}/{examId}")
    public ResponseEntity<ExamResult> computeResult(@PathVariable int candidateId, @PathVariable int examId) {
        ExamResult result = examResultService.computeAndSaveResult(candidateId, examId);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<ExamResult>> getResultsByExam(@PathVariable int examId) {
        List<ExamResult> results = examResultService.getResultsByExam(examId);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/exam/{examId}/candidate/{candidateId}")
    public ResponseEntity<ExamResult> getResultByExamAndCandidate(@PathVariable int examId, @PathVariable int candidateId) {
        ExamResult result = examResultService.getResultByExamAndCandidate(examId, candidateId);
        return ResponseEntity.ok(result);
    }
}
