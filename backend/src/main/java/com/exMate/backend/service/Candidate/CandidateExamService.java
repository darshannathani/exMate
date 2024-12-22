package com.exMate.backend.service.Candidate;


import com.exMate.backend.DTO.ExamDetailsDTO;
import com.exMate.backend.DTO.ExamResponseDTO;
import com.exMate.backend.DTO.ExamQuestionResponseDTO;
import com.exMate.backend.model.*;
import com.exMate.backend.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateExamService {

    private final ExamRepository examRepository;
    private final ExamQuestionMappingRepository examQuestionMappingRepository;
    private final QuestionRepository questionRepository;
    private final ResponseRepository responseRepository;
    private final ExamLogRepository examLogRepository;
    private final CandidateRepository candidateRepository;
    private final CandidateService candidateService;
    private final MCQOptionRepository MCQOptionRepository;

    @Autowired
    public CandidateExamService(ExamRepository examRepository, ExamQuestionMappingRepository examQuestionMappingRepository, QuestionRepository questionRepository, ResponseRepository responseRepository, ExamLogRepository examLogRepository, CandidateRepository candidateRepository, CandidateService candidateService, MCQOptionRepository MCQOptionRepository) {
        this.examRepository = examRepository;
        this.examQuestionMappingRepository = examQuestionMappingRepository;
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
        this.examLogRepository = examLogRepository;
        this.candidateRepository = candidateRepository;
        this.candidateService = candidateService;
        this.MCQOptionRepository = MCQOptionRepository;
    }

    public List<Exam> getCandidateExam() {
        List<Exam> exams = examRepository.findAll();
        LocalDateTime now = LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS);
        return exams.stream()
                .filter(exam -> exam.getStart_date() != null && exam.getEnd_date() != null)
                .filter(exam -> exam.getStart_date().isBefore(now) && exam.getEnd_date().isAfter(now))
                .collect(Collectors.toList());
    }

    public Exam getCandidateExamById(int exam_id) {
        return examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
    }

    public ExamResponseDTO startExam(int exam_id, HttpServletRequest request) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        if (exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }

        Candidate candidate = candidateService.getCurrentCandidate(request)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        ExamLog existingLog = examLogRepository.findByExamAndCandidate(exam, candidate)
                .orElse(null);
        if (existingLog == null) {
            ExamLog examLog = new ExamLog();
            examLog.setExam(exam);
            examLog.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
            examLog.setCandidate(candidate);
            examLog.setExam_flag(0);
            examLogRepository.save(examLog);
        }

        List<ExamQuestionMapping> mappings = examQuestionMappingRepository.findAllByExam(exam);
        List<ExamQuestionResponseDTO> questions = new ArrayList<>();

        for (ExamQuestionMapping mapping : mappings) {
            Question question = mapping.getQuestion();
            List<MCQOption> options = MCQOptionRepository.findAllByQuestion(question);
            questions.add(new ExamQuestionResponseDTO(question, options));
        }

        ExamDetailsDTO examDetails = new ExamDetailsDTO(
                exam.getDuration(),
                exam.getTitle(),
                exam.getDescription()
        );

        ExamResponseDTO res = new ExamResponseDTO(questions, examDetails);
        return res;
    }


    public String saveResponses(int exam_id, List<Response> responses, HttpServletRequest request) {
        Candidate candidate = candidateService.getCurrentCandidate(request)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        ExamLog examLog = examLogRepository.findByExamAndCandidate(exam, candidate)
                .orElseThrow(() -> new RuntimeException("Exam log not found"));
        if (examLog.getExam_flag() == 1) {
            throw new RuntimeException("Exam has already been submitted");
        }

        for (Response response : responses) {
            Response existingResponse = responseRepository.findByCandidateAndExamAndQuestion(
                    candidate, exam, response.getQuestion()).orElse(null);

            if (existingResponse != null) {
                existingResponse.setOption(response.getOption());
                existingResponse.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
                responseRepository.save(existingResponse);
            } else {
                response.setCandidate(candidate);
                response.setExam(exam);
                response.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
                responseRepository.save(response);
            }
        }

        return "Responses saved successfully";
    }


    public String endExam(int exam_id, HttpServletRequest request) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));

        Candidate candidate = candidateService.getCurrentCandidate(request)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        ExamLog examLog = examLogRepository.findByExamAndCandidate(exam, candidate)
                .orElseThrow(() -> new RuntimeException("Exam log not found"));
        examLog.setTimestamp(LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));
        examLog.setExam_flag(1);
        examLogRepository.save(examLog);

        return "Exam ended successfully";
    }
}
