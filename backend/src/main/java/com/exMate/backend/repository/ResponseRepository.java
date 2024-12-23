package com.exMate.backend.repository;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Exam;
import com.exMate.backend.model.Question;
import com.exMate.backend.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Integer> {
    List<Response> findAllByCandidateAndExam(Candidate candidate, Exam exam);

    Optional<Response> findByCandidateAndExamAndQuestion(Candidate candidate, Exam exam, Question question);

    List<Response> findByCandidateAndExam(Candidate candidate, Exam exam);

    List<Response> findByExam(Exam exam);
}
