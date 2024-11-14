package com.exMate.backend.repository;

import com.exMate.backend.model.MCQOption;
import com.exMate.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MCQOptionRepository extends JpaRepository<MCQOption, Integer> {
    void deleteByQuestion(Question question);

    MCQOption findByQuestion(Question question);
}