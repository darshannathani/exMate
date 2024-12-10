package com.exMate.backend.repository;

import com.exMate.backend.model.ExamLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamLogRepository extends JpaRepository<ExamLog, Integer> {
}
