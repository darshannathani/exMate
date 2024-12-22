package com.exMate.backend.service.Admin;

import com.exMate.backend.enums.SectionType;
import com.exMate.backend.model.*;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.repository.ExamRepository;
import com.exMate.backend.repository.ExamResultRepository;
import com.exMate.backend.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public ExamResult computeAndSaveResult(int candidateId, int examId) {
        Exam exam1 = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        Candidate candidate1 = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<Response> responses = responseRepository.findByCandidateAndExam(candidate1, exam1);

        if (responses.isEmpty()) {
            throw new RuntimeException("No responses found for candidate " + candidateId + " in exam " + examId);
        }
        Exam exam = responses.get(0).getExam();
        Candidate candidate = responses.get(0).getCandidate();
        int totalScore = calculateTotalScore(responses);
        String status = totalScore >= exam.getPassing_score() ? "PASSED" : "FAILED";
        ExamResult examResult = new ExamResult();
        examResult.setCandidate(candidate);
        examResult.setExam(exam);
        examResult.setScore(totalScore);
        examResult.setStatus(status);
        examResult.setDate_completed(LocalDateTime.now());

        return examResultRepository.save(examResult);
    }

    private int calculateTotalScore(List<Response> responses) {
        int totalScore = 0;
        Map<SectionType, List<Response>> sectionResponses = responses.stream()
                .collect(Collectors.groupingBy(r -> r.getQuestion().getSection_type()));
        if (sectionResponses.containsKey(SectionType.TECHNICAL)) {
            totalScore += sectionResponses.get(SectionType.TECHNICAL).stream()
                    .filter(Response::is_correct)
                    .mapToInt(r -> r.getQuestion().getMarks())
                    .sum();
        }
        if (sectionResponses.containsKey(SectionType.LOGICAL)) {
            totalScore += sectionResponses.get(SectionType.LOGICAL).stream()
                    .filter(Response::is_correct)
                    .mapToInt(r -> r.getQuestion().getMarks())
                    .sum();
        }
        if (sectionResponses.containsKey(SectionType.PROGRAMMING)) {
            totalScore += sectionResponses.get(SectionType.PROGRAMMING).stream()
                    .filter(Response::is_correct)
                    .mapToInt(r -> r.getQuestion().getMarks())
                    .sum();
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