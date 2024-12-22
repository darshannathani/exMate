package com.exMate.backend.repository;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Exam;
import com.exMate.backend.model.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {
    List<ExamResult> findAllByExam(Exam exam);

    List<ExamResult> findByCandidate(Candidate candidate);

    Optional<ExamResult> findByCandidateAndExam(Candidate candidate, Exam exam);

    List<ExamResult> findByExam(Exam exam);
}
