package com.exMate.backend.repository;

import com.exMate.backend.model.ExamQuestionMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamQuestionMappingRepository extends JpaRepository<ExamQuestionMapping, Integer> {

    List<ExamQuestionMapping> findByExam_Id(int exam_id);
}