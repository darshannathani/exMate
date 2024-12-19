package com.exMate.backend.repository;

import com.exMate.backend.model.Candidate;
import com.exMate.backend.model.Exam;
import com.exMate.backend.model.ExamLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExamLogRepository extends JpaRepository<ExamLog, Integer> {
    Optional<ExamLog> findByExamAndCandidate(Exam exam, Candidate candidate);
}
