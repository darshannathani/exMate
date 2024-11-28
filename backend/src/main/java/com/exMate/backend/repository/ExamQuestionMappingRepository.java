package com.exMate.backend.repository;

import com.exMate.backend.model.Exam;
import com.exMate.backend.model.ExamQuestionMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionMappingRepository extends JpaRepository<ExamQuestionMapping, Integer> {
    List<ExamQuestionMapping> findByExam(Exam exam);
    void deleteAllByExam(Exam exam);
    List<ExamQuestionMapping> findAllByExam(Exam exam);
}