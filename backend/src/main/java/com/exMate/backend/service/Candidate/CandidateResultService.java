package com.exMate.backend.service.Candidate;


import com.exMate.backend.DTO.CandidateResultDTO;
import com.exMate.backend.DTO.QuestionResponseDTO;
import com.exMate.backend.DTO.SectionScoreDTO;
import com.exMate.backend.model.*;
import com.exMate.backend.enums.SectionType;
import com.exMate.backend.repository.CandidateRepository;
import com.exMate.backend.repository.ExamRepository;
import com.exMate.backend.repository.ExamResultRepository;
import com.exMate.backend.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateResultService {
    private final ExamResultRepository examResultRepository;
    private final ResponseRepository responseRepository;
    private final CandidateRepository candidateRepository;
    private final ExamRepository examRepository;

    public List<CandidateResultDTO> getAllResultsForCandidate(int candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<ExamResult> results = examResultRepository.findByCandidate(candidate);
        return results.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CandidateResultDTO getDetailedExamResult(int candidateId, int examId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        ExamResult result = examResultRepository.findByCandidateAndExam(candidate, exam)
                .orElseThrow(() -> new RuntimeException("Result not found"));

        List<Response> responses = responseRepository.findByCandidateAndExam(candidate, exam);

        return createDetailedResultDTO(result, responses);
    }

    public Map<SectionType, SectionScoreDTO> getSectionWiseAnalysis(int candidateId, int examId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        List<Response> responses = responseRepository.findByCandidateAndExam(candidate, exam);

        return responses.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getQuestion().getSection_type(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                this::calculateSectionScore
                        )
                ));
    }

    private SectionScoreDTO calculateSectionScore(List<Response> sectionResponses) {
        int totalQuestions = sectionResponses.size();
        long correctAnswers = sectionResponses.stream().filter(Response::is_correct).count();
        int totalMarks = sectionResponses.stream()
                .mapToInt(r -> r.getQuestion().getMarks())
                .sum();
        int obtainedMarks = sectionResponses.stream()
                .filter(Response::is_correct)
                .mapToInt(r -> r.getQuestion().getMarks())
                .sum();

        return new SectionScoreDTO(
                totalQuestions,
                correctAnswers,
                totalMarks,
                obtainedMarks,
                calculatePercentage(obtainedMarks, totalMarks)
        );
    }

    private double calculatePercentage(int obtained, int total) {
        return total == 0 ? 0 : (obtained * 100.0) / total;
    }

    private CandidateResultDTO convertToDTO(ExamResult result) {
        return CandidateResultDTO.builder()
                .resultId(result.getResult_id())
                .examId(result.getExam().getExam_id())
                .examTitle(result.getExam().getTitle())
                .score(result.getScore())
                .totalMarks(result.getExam().getTotal_marks())
                .status(result.getStatus())
                .dateCompleted(result.getDate_completed())
                .percentageScore(calculatePercentage(result.getScore(), result.getExam().getTotal_marks()))
                .build();
    }

    private CandidateResultDTO createDetailedResultDTO(ExamResult result, List<Response> responses) {
        CandidateResultDTO dto = convertToDTO(result);
        List<QuestionResponseDTO> questionResponses = responses.stream()
                .map(response -> QuestionResponseDTO.builder()
                        .questionId(response.getQuestion().getQuestion_id())
                        .questionText(response.getQuestion().getText())
                        .sectionType(response.getQuestion().getSection_type())
                        .marks(response.getQuestion().getMarks())
                        .correct(response.is_correct())
                        .selectedOption(response.getOption() != null ? response.getOption().getOption_text() : null)
                        .programmingResponse(response.getProgramming_response())
                        .build())
                .collect(Collectors.toList());
        dto.setQuestionResponses(questionResponses);
        dto.setSectionScores(getSectionWiseAnalysis(result.getCandidate().getC_id(), result.getExam().getExam_id()));
        return dto;
    }

    public List<CandidateResultDTO> getCompletedExams(int candidateId) {
        return getAllResultsForCandidate(candidateId);
    }

    public List<CandidateResultDTO> getPendingExams(int candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        List<Integer> completedExamIds = examResultRepository.findByCandidate(candidate)
                .stream()
                .map(result -> result.getExam().getExam_id())
                .collect(Collectors.toList());
        return List.of();
    }
}
