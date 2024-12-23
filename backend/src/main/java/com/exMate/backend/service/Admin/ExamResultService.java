package com.exMate.backend.service.Admin;

import com.exMate.backend.enums.SectionType;
import com.exMate.backend.model.*;
import com.exMate.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultService {
    private final ResponseRepository responseRepository;
    private final ExamResultRepository examResultRepository;
    private final CandidateRepository candidateRepository;
    private final ExamRepository examRepository;
    private final ExamLogRepository examLogRepository;

    @Transactional
    public List<ExamResult> computeAndSaveResultsForExam(int examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Get all candidates who have responses for this exam
        List<Candidate> candidates = responseRepository.findByExam(exam)
                .stream()
                .map(Response::getCandidate)
                .distinct()
                .collect(Collectors.toList());

        if (candidates.isEmpty()) {
            throw new RuntimeException("No candidates found for exam " + examId);
        }

        List<ExamResult> results = new ArrayList<>();

        // Compute results for each candidate
        for (Candidate candidate : candidates) {
            try {
                ExamResult result = computeAndSaveResult(candidate.getC_id(), examId);
                results.add(result);
            } catch (RuntimeException e) {
                // Log the error and continue with next candidate
                System.err.println("Error computing result for candidate " + candidate.getC_id() + ": " + e.getMessage());
            }
        }

        return results;
    }

    @Transactional
    public ExamResult computeAndSaveResult(int candidateId, int examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        List<Response> responses = responseRepository.findByCandidateAndExam(candidate, exam);

        if (responses.isEmpty()) {
            throw new RuntimeException("No responses found for candidate " + candidateId + " in exam " + examId);
        }

        // Update is_correct field for each response
        for (Response response : responses) {
            Question question = response.getQuestion();

            if (question.getSection_type() == SectionType.PROGRAMMING) {
                // For programming questions, you'll need to implement your own validation logic
                // This is just a placeholder - implement your actual programming response validation
                continue;
            } else {
                // For MCQ questions
                MCQOption selectedOption = response.getOption();
                if (selectedOption != null) {
                    // Set is_correct as String ("true" or "false")
                    response.setIs_correct(selectedOption.getIs_correct());
                } else {
                    response.setIs_correct("false");
                }
            }
        }

        // Save updated responses
        responseRepository.saveAll(responses);

        // Calculate total score
        int totalScore = calculateTotalScore(responses);

        // Create and save exam result
        String status = totalScore >= exam.getPassing_score() ? "PASSED" : "FAILED";
        ExamResult examResult = new ExamResult();
        examResult.setCandidate(candidate);
        examResult.setExam(exam);
        examResult.setScore(totalScore);
        examResult.setStatus(status);
        examResult.setDate_completed(LocalDateTime.now());

        // Update exam log with the score
        ExamLog examLog = examLogRepository.findByCandidateAndExam(candidate, exam)
                .orElse(new ExamLog());

        examLog.setCandidate(candidate);
        examLog.setExam(exam);
        examLog.setExam_flag(totalScore);
        examLog.setTimestamp(LocalDateTime.now());
        examLogRepository.save(examLog);

        return examResultRepository.save(examResult);
    }

    private int calculateTotalScore(List<Response> responses) {
        int totalScore = 0;
        Map<SectionType, List<Response>> sectionResponses = responses.stream()
                .collect(Collectors.groupingBy(r -> r.getQuestion().getSection_type()));

        for (SectionType sectionType : SectionType.values()) {
            if (sectionResponses.containsKey(sectionType)) {
                totalScore += sectionResponses.get(sectionType).stream()
                        .filter(r -> "true".equalsIgnoreCase(r.getIs_correct()))  // Changed to String comparison
                        .mapToInt(r -> r.getQuestion().getMarks())
                        .sum();
            }
        }

        return totalScore;
    }

    public List<ExamResult> getResultsByExam(int examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        return examResultRepository.findByExam(exam);
    }

    public ExamResult getResultByExamAndCandidate(int examId, int candidateId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return examResultRepository.findByCandidateAndExam(candidate, exam)
                .orElseThrow(() -> new RuntimeException("Result not found"));
    }
}