package com.exMate.backend.service.Candidate;

import com.exMate.backend.model.Exam;
import com.exMate.backend.model.ExamQuestionMapping;
import com.exMate.backend.model.Question;
import com.exMate.backend.repository.ExamQuestionMappingRepository;
import com.exMate.backend.repository.ExamRepository;
import com.exMate.backend.repository.QuestionRepository;
import com.exMate.backend.repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.exMate.backend.model.Response;

import java.time.LocalDate;
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
    @Autowired
    public CandidateExamService(ExamRepository examRepository, ExamQuestionMappingRepository examQuestionMappingRepository, QuestionRepository questionRepository, ResponseRepository responseRepository) {
        this.examRepository = examRepository;
        this.examQuestionMappingRepository = examQuestionMappingRepository;
        this.questionRepository = questionRepository;
        this.responseRepository = responseRepository;
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

    public List<Question> startExam(int exam_id) {
        Exam exam = examRepository.findById(exam_id)
                .orElseThrow(() -> new RuntimeException("Exam not found with id: " + exam_id));
        if(exam.getEnd_date().isBefore(exam.getStart_date())) {
            throw new RuntimeException("End date cannot be before start date");
        }
        List<ExamQuestionMapping> mappings = examQuestionMappingRepository.findAllByExam(exam);
        List<Question> questions= new ArrayList<>();
        for (ExamQuestionMapping mapping : mappings) {
            questions.add(mapping.getQuestion());
        }
        return questions;
    }

    public void saveMcqResponses(int exam_id, List<Response> responses) {
        responseRepository.saveAll(responses);
    }

    public void saveProgrammingResponses(int exam_id, List<Response> responses) {
        responseRepository.saveAll(responses);
    }

    public void saveDatabaseResponses(int exam_id, List<Response> responses) {
        responseRepository.saveAll(responses);
    }
}
