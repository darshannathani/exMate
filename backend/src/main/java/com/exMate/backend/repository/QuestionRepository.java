package com.exMate.backend.repository;

import com.exMate.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    @Query(value = """
        SELECT *
        FROM (
            SELECT *, ROW_NUMBER() OVER (ORDER BY NEWID()) AS row_num
            FROM question_bank
            WHERE (:difficulty IS NULL OR difficulty = :difficulty)
            AND (:sectionType IS NULL OR section_type = :sectionType)
        ) AS temp
        WHERE row_num <= :limit
        """, nativeQuery = true)
    List<Question> findRandomQuestionsByDifficultyAndSectionType(
            @Param("difficulty") String difficulty,
            @Param("sectionType") String sectionType,
            @Param("limit") int limit
    );



    List<Question> findByCategory_Name(String categoryName);
}