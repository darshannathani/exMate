package com.exMate.backend.repository;

import com.exMate.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {

    public Question findByCategory(String category);
    public Iterable<Question> findBySection(String section);
}
